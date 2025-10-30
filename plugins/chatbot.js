const { cmd } = require('../command');
const axios = require('axios');

let chatbotEnabled = false; // default OFF

// 🔘 Command to enable/disable chatbot
cmd({
    pattern: "chatbot",
    alias: ["autoai", "botchat"],
    desc: "Enable or disable the auto AI chatbot",
    category: "AI",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        const option = (args[0] || "").toLowerCase();

        if (option === "on") {
            chatbotEnabled = true;
            await reply("✅ *ChatBot enabled!*\nNow I’ll automatically reply to all messages.");
            await conn.sendMessage(m.chat, { react: { text: "🟢", key: mek.key } });
        } else if (option === "off") {
            chatbotEnabled = false;
            await reply("❌ *ChatBot disabled!*\nI’ll stop replying automatically.");
            await conn.sendMessage(m.chat, { react: { text: "🔴", key: mek.key } });
        } else {
            await reply(
                `⚙️ *ChatBot Control*\n\nUsage:\n.chatbot on  → Enable auto AI chat\n.chatbot off → Disable auto AI chat\n\nCurrent: ${chatbotEnabled ? "🟢 ON" : "🔴 OFF"}`
            );
            await conn.sendMessage(m.chat, { react: { text: "ℹ️", key: mek.key } });
        }
    } catch (e) {
        console.error(e);
        await reply("⚠️ Error toggling chatbot mode.");
    }
});

// 💬 Auto AI Reply when enabled
cmd({
    pattern: "autoreply",
    dontAddCommandList: true
},
async (conn, mek, m, { body }) => {
    try {
        if (!chatbotEnabled) return;
        if (mek.key.fromMe) return;

        const message = body?.trim();
        if (!message) return;

        const API_URL = "https://chatbot-api-key-eda9b68bbf35.herokuapp.com/api/chat";
        const res = await axios.post(API_URL, { message }); // ✅ fixed key

        const aiReply = res.data?.reply || "🤖 (No reply)";
        await conn.sendMessage(m.chat, { text: aiReply }, { quoted: mek });
        await conn.sendMessage(m.chat, { react: { text: "☺️", key: mek.key } });

    } catch (err) {
        console.error("AI Reply Error:", err);
    }
});
