const { cmd } = require('../command');
const axios = require('axios');

// Global flag for chatbot status
let chatbotEnabled = false;

// ===============================
// 🤖 ChatBot Toggle Command
// ===============================
cmd({
    pattern: "chatbot",
    desc: "Enable/disable ChatBot auto-reply mode",
    category: "AI",
    react: "😐",
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
    try {
        const text = q ? q.toLowerCase() : "";

        if (!text) {
            await conn.sendMessage(from, { react: { text: "ℹ️", key: mek.key } });
            return reply(`⚙️ *ChatBot Controller*\n\nUse:\n.chatbot on — Enable\n.chatbot off — Disable\n.chatbot status — Check`);
        }

        if (text === "on") {
            chatbotEnabled = true;
            await reply("✅ *ChatBot mode enabled!* 🤖");
            await conn.sendMessage(from, { react: { text: "🟢", key: mek.key } });
        } 
        else if (text === "off") {
            chatbotEnabled = false;
            await reply("❌ *ChatBot mode disabled!* 😴");
            await conn.sendMessage(from, { react: { text: "🔴", key: mek.key } });
        } 
        else if (text === "status") {
            await reply(`📊 *ChatBot status:* ${chatbotEnabled ? "🟢 ON" : "🔴 OFF"}`);
            await conn.sendMessage(from, { react: { text: "📊", key: mek.key } });
        } 
        else {
            await reply("⚠️ Invalid option. Use `.chatbot on` or `.chatbot off`");
        }
    } catch (e) {
        console.error(e);
        await reply("❌ Error while toggling ChatBot.");
    }
});

// ===============================
// 💬 Auto AI Reply (global listener)
// ===============================
cmd({
    pattern: "autoreply",
    dontAddCommandList: true,
}, 
async (conn, mek, m, { from, body }) => {
    try {
        if (!chatbotEnabled) return; // chatbot off
        if (mek.key.fromMe) return;  // skip bot’s own messages

        const msg = body?.trim();
        if (!msg) return;

        const API_URL = "https://chatbot-api-key-eda9b68bbf35.herokuapp.com/api/chat";

        const res = await axios.post(API_URL, { prompt: msg });
        const replyText = res.data?.reply || "🤖 (No AI response)";

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });

    } catch (err) {
        console.error("AI ChatBot Error:", err);
    }
});
