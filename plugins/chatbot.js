const { cmd } = require('../command');
const axios = require('axios');

let aiChatEnabled = false; // toggle control

cmd({
    pattern: "chatbot",
    desc: "Enable or disable auto AI chat replies",
    category: "AI",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(`⚙️ *Chatbot Control*\n\nUse:\n.chatbot on — enable auto replies\n.chatbot off — disable auto replies\n.chatbot status — check status`);
        }

        const input = q.toLowerCase();
        if (input === "on") {
            aiChatEnabled = true;
            await reply("✅ *Chatbot is now enabled.*");
            await conn.sendMessage(from, { react: { text: "🟢", key: mek.key } });
        } else if (input === "off") {
            aiChatEnabled = false;
            await reply("❌ *Chatbot is now disabled.*");
            await conn.sendMessage(from, { react: { text: "🔴", key: mek.key } });
        } else if (input === "status") {
            const status = aiChatEnabled ? "🟢 ON" : "🔴 OFF";
            await reply(`🤖 *Chatbot status:* ${status}`);
        } else {
            await reply("❌ Invalid option. Use `.chatbot on/off/status`");
        }
    } catch (e) {
        console.error(e);
        reply("⚠️ *Error toggling chatbot.*");
    }
});

// ========== AUTO REPLY HANDLER ==========
cmd({
    pattern: "autoreply",
    dontAddCommandList: true
},
async (conn, mek, m, { body, reply }) => {
    try {
        if (!aiChatEnabled) return; // only work when chatbot is ON

        const API_URL = "https://chatbot-api-key-eda9b68bbf35.herokuapp.com/api/chat";

        // Send message to AI API
        const res = await axios.post(API_URL, { message: body });
        const aiReply = res.data?.reply || "🤖 (no reply)";

        // Reply with AI's message
        await conn.sendMessage(m.chat, { text: aiReply }, { quoted: mek });
        await conn.sendMessage(m.chat, { react: { text: "☺️", key: mek.key } });

    } catch (err) {
        console.error(err);
    }
});
