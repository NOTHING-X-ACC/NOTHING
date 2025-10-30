const { cmd } = require('../command');
const axios = require('axios');

// 🧠 Global chatbot toggle
let chatBotEnabled = false;

// =========================
// 🤖 ChatBot Controller
// =========================
cmd({
    pattern: "chatbot",
    alias: ["autoai", "aichat"],
    desc: "Enable or disable ChatBot auto mode",
    category: "AI",
    react: "🙄",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q ? q.toLowerCase() : "";

        if (!input) {
            return reply(`⚙️ *ChatBot Controller*\n\nUsage:\n.chatbot on — enable auto chat\n.chatbot off — disable chat\n.chatbot status — check mode`);
        }

        if (input === "on") {
            chatBotEnabled = true;
            await reply("✅ *ChatBot mode enabled!* 🤖");
            await conn.sendMessage(from, { react: { text: "🟢", key: mek.key } });
        } else if (input === "off") {
            chatBotEnabled = false;
            await reply("❌ *ChatBot mode disabled!* 😴");
            await conn.sendMessage(from, { react: { text: "🔴", key: mek.key } });
        } else if (input === "status") {
            await reply(`📊 *ChatBot mode:* ${chatBotEnabled ? "🟢 ON" : "🔴 OFF"}`);
            await conn.sendMessage(from, { react: { text: "📊", key: mek.key } });
        } else {
            await reply("⚠️ Invalid option. Use `.chatbot on` or `.chatbot off`");
        }

    } catch (err) {
        console.error("ChatBot command error:", err);
        await reply("❌ Error while changing ChatBot mode.");
    }
});

// =========================
// 💬 Auto AI Reply System
// =========================
cmd({
    pattern: "autoreply",
    dontAddCommandList: true,
},
async (conn, mek, m, { from, body }) => {
    try {
        // Skip if off or bot's own msg
        if (!chatBotEnabled || mek.key.fromMe) return;
        const text = body?.trim();
        if (!text) return;

        // 🌐 Your ChatBot API
        const API_URL = "https://chatbot-api-key-eda9b68bbf35.herokuapp.com/api/chat";

        const res = await axios.post(API_URL, { prompt: text });
        const replyText = res.data?.reply || "🤖 No reply from AI.";

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });

    } catch (err) {
        console.error("AI ChatBot Error:", err);
    }
});
