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
        return reply("✅ *AntiBot has been activated in this group!*\n\nAny suspicious bot-like users sending commands will be removed immediately 😎");
    } else if (args === "off") {
        antibotStatus[from].enabled = false;
        saveStatus();
        return reply("🚫 *AntiBot has been deactivated in this group.*\n\nBots are now allowed here 😌");
    } else {
        return reply(`📊 *AntiBot Status:* ${antibotStatus[from].enabled ? "✅ ON" : "❌ OFF"}\n\nUse:\n.antibot on — to enable\n.antibot off — to disable`);
    }
});


// === [ 🕵️ INSTANT BOT DETECTION HANDLER ] ===
// Common command prefixes (koi bhi user agar in se shuru hone wala message bhejega toh suspect hoga)
const commandPrefixes = ['.', '!', '/', '#', '>', '$', '?', '@']; 

cmd({
    on: "message"
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!m.isGroup || !antibotStatus[from]?.enabled) return;
        
        // Apne bot ka message ignore karo taaki infinite loop na ho
        if (m.key.fromMe) return; 

        const sender = m.key.participant;
        if (!sender) return;

        const text = m.text?.trim() || '';

        // Agar user group admin hai to usko ignore karo
        if (isAdmins) return; 
        
        // Check karo kya message command hai?
        const isCommandMessage = commandPrefixes.some(prefix => text.startsWith(prefix));

        if (isCommandMessage) {
            console.log(`🚨 AntiBot: Instant command-based detection triggered for ${sender}.`);
            
            if (isBotAdmins) {
                // Kick the user (Turant remove)
                await conn.groupParticipantsUpdate(from, [sender], 'remove');
                await conn.sendMessage(from, {
                    text: `🚨 *Bot-like account removed automatically!*\n@${sender.split('@')[0]} was removed for sending a command immediately 🚫.`,
                    mentions: [sender]
                });
            } else {
                // Warn about admin rights
                await conn.sendMessage(from, {
                    text: "⚠️ I detected a suspicious *command message*, but I'm not admin.\nPlease make me *admin* to auto-remove bots 😇"
                });
            }
        }

    } catch (err) {
        console.error("❌ AntiBot Handler Error:", err);
    }
});
