const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// File to store antibot status per group
const filePath = path.join(__dirname, '../lib/antibot-status.json');

// ✅ Create antibot file if missing
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
}

// ✅ Load status
let antibotStatus = JSON.parse(fs.readFileSync(filePath));

// 💾 Save function
function saveStatus() {
    fs.writeFileSync(filePath, JSON.stringify(antibotStatus, null, 2));
}

// === [ 🧠 COMMAND: .antibot on/off ] ===
cmd({
    pattern: "antibot",
    alias: ["botblock", "banbot", "abot", "antbot"],
    desc: "Enable or disable the AntiBot system in a group.",
    category: "group",
    react: "🤖",
    use: ".antibot on/off",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, reply }) => {
    if (!isGroup) return reply("❌ This command only works in groups.");
    if (!isAdmins) return reply("⛔ Only *group admins* can use this command.");

    const args = q.trim().toLowerCase();
    if (!antibotStatus[from]) antibotStatus[from] = { enabled: false };

    if (args === "on") {
        antibotStatus[from].enabled = true;
        saveStatus();
        return reply("✅ *AntiBot has been activated in this group!*\n\nBots sending high-speed messages or commands will be removed! 😎");
    } else if (args === "off") {
        antibotStatus[from].enabled = false;
        saveStatus();
        return reply("🚫 *AntiBot has been deactivated in this group.*");
    } else {
        return reply(`📊 *AntiBot Status:* ${antibotStatus[from].enabled ? "✅ ON" : "❌ OFF"}\n\nUse:\n.antibot on — to enable\n.antibot off — to disable`);
    }
});


// === [ 🕵️ DUAL FLOOD DETECTION HANDLER (MOST EFFECTIVE) ] ===
global.floodTrack = global.floodTrack || {};

const GENERAL_FLOOD_TIME = 5000; // 5 seconds
const GENERAL_FLOOD_LIMIT = 5;  // 5 messages (koi bhi)

const COMMAND_FLOOD_TIME = 5000; // 5 seconds
const COMMAND_FLOOD_LIMIT = 3;  // 3 commands (prefix ke saath)

const commandPrefixes = ['.', '!', '/', '#', '>', '$', '?', '@']; 

cmd({
    on: "message"
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!m.isGroup || !antibotStatus[from]?.enabled) return;
        if (m.key.fromMe) return; // Apne bot ka message ignore karo

        const sender = m.key.participant;
        if (!sender) return;

        const text = m.text?.trim() || '';

        // Agar user group admin hai to usko ignore karo
        if (isAdmins) return; 

        // Initialize tracking for the sender 
        if (!global.floodTrack[sender]) {
            global.floodTrack[sender] = { general: [], command: [] };
        }

        const currentTime = Date.now();
        let actionReason = null;
        
        // --- 1. GENERAL FLOOD CHECK (Koi bhi message) ---
        global.floodTrack[sender].general.push(currentTime);
        global.floodTrack[sender].general = global.floodTrack[sender].general.filter(
            time => currentTime - time <= GENERAL_FLOOD_TIME
        );

        if (global.floodTrack[sender].general.length >= GENERAL_FLOOD_LIMIT) {
            actionReason = `sent ${global.floodTrack[sender].general.length} messages in ${GENERAL_FLOOD_TIME/1000} seconds (Flood)`;
        }

        // --- 2. COMMAND FLOOD CHECK (Sirf commands) ---
        const isCommand = commandPrefixes.some(prefix => text.startsWith(prefix));

        if (isCommand) {
            global.floodTrack[sender].command.push(currentTime);
            global.floodTrack[sender].command = global.floodTrack[sender].command.filter(
                time => currentTime - time <= COMMAND_FLOOD_TIME
            );

            if (global.floodTrack[sender].command.length >= COMMAND_FLOOD_LIMIT) {
                actionReason = `sent ${global.floodTrack[sender].command.length} commands in ${COMMAND_FLOOD_TIME/1000} seconds (Command Flood)`;
            }
        }
        
        // --- 3. KICK ACTION ---
        if (actionReason) {
            console.log(`\n🚨 ANTI-BOT ACTION! Sender: ${sender}, Reason: ${actionReason}`);
            
            // Tracking data clear karo
            delete global.floodTrack[sender]; 
            
            if (isBotAdmins) {
                // KICK HO JAYEGA
                await conn.groupParticipantsUpdate(from, [sender], 'remove');
                await conn.sendMessage(from, {
                    text: `🚨 *Bot-like account removed automatically!*\n@${sender.split('@')[0]} was removed because they ${actionReason} 😠.`,
                    mentions: [sender]
                });
            } else {
                // WARN KAREGA
                await conn.sendMessage(from, {
                    text: `⚠️ I detected *${actionReason}* activity, but I'm not admin.\nPlease make me *admin* to auto-remove bots 😇`
                });
            }
        }

    } catch (err) {
        console.error("❌ AntiBot Handler Error:", err);
    }
});
