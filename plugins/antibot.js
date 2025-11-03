Thos is for your bot 


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

// 🧠 Command: antibot on/off
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
        return reply("✅ *AntiBot has been activated in this group!*\n\nAny suspicious bot-like users will be removed automatically 😎");
    } else if (args === "off") {
        antibotStatus[from].enabled = false;
        saveStatus();
        return reply("🚫 *AntiBot has been deactivated in this group.*\n\nBots are now allowed here 😌");
    } else {
        return reply(`📊 *AntiBot Status:* ${antibotStatus[from].enabled ? "✅ ON" : "❌ OFF"}\n\nUse:\n.antibot on — to enable\n.antibot off — to disable`);
    }
});

// 🕵️ Auto message handler
cmd({
    on: "message"
}, async (conn, mek, m, { from, isBotAdmins }) => {
    try {
        if (!m.isGroup || !antibotStatus[from]?.enabled) return;
        if (m.key.fromMe) return; // Ignore bot's own messages

        const sender = m.key.participant;
        if (!sender) return;

        // 🔍 Patterns used by typical bots (EBO, AEB, MD bots, etc.)
        const botPatterns = [
            /^3E/, /^4E/, /^5E/, /^6E/, /^7E/, /^8E/, /^9E/,
            /^AE/, /^BE/, /^CE/, /^DE/, /^EE/, /^FE/, /^MD/, /^BOT/
        ];

        // 🧩 Check if message id looks bot-like
        const isBotLike = botPatterns.some(rx => rx.test(m.key.id));

        // 🧮 Message spam counter
        global.botMsgCount = global.botMsgCount || {};
        if (!global.botMsgCount[from]) global.botMsgCount[from] = {};
        global.botMsgCount[from][sender] = (global.botMsgCount[from][sender] || 0) + 1;

        if (isBotLike || global.botMsgCount[from][sender] >= 5) {
            if (isBotAdmins) {
                await conn.groupParticipantsUpdate(from, [sender], 'remove');
                await conn.sendMessage(from, {
                    text: `🚨 *Bot-like account removed automatically!*\n@${sender.split('@')[0]} looked suspicious 😐`,
                    mentions: [sender]
                });
                delete global.botMsgCount[from][sender];
            } else {
                await conn.sendMessage(from, {
                    text: "⚠️ I detected suspicious bot activity, but I'm not admin.\nPlease make me *admin* to auto-remove bots 😇"
                });
            }
        }

    } catch (err) {
        console.error("❌ AntiBot Handler Error:", err);
    }
});
