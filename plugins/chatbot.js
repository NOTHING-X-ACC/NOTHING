const { cmd } = require('../command');
const axios = require('axios');

// ChatBot Toggle State
let chatBotEnabled = false;

// ========================
// 🤖 Chat Bot Auto Mode
// ========================
cmd({
    pattern: "chatbot",
    alias: ["autoai", "aichat"],
    desc: "Enable or disable Auto ChatBot mode",
    category: "AI",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        // When no args given → show usage
        if (!q) {
            return reply(
                `🤖 *ChatBot Mode Control*\n\nUsage:\n.chatbot on — enable auto chat\n.chatbot off — disable chat\n.chatbot status — check current mode`
            );
        }

        const lower = q.toLowerCase();

        if (lower === "on") {
            chatBotEnabled = true;
            await reply("✅ *ChatBot Mode Enabled!* 🤖\nNow I'll reply to every message automatically.");
        } else if (lower === "off") {
            chatBotEnabled = false;
            await reply("❌ *ChatBot Mode Disabled!* 😴");
        } else if (lower === "status") {
            await reply(`📊 *ChatBot Mode:* ${chatBotEnabled ? "🟢 ON" : "🔴 OFF"}`);
        } else {
            await reply("⚙️ *Unknown option.* Use `.chatbot on/off/status`");
        }
    } catch (e) {
        console.error(e);
        await reply("❌ Error toggling chatbot mode.");
    }
});

// ============================
// 🧠 AUTO REPLY HANDLER (MAIN)
// ============================
cmd({
    pattern: "autoreply",
    dontAddCommandList: true,
},
async (conn, mek, m, { from, body, reply, sender }) => {
    try {
        if (!chatBotEnabled) return;

        // Ignore bot’s own messages
        if (mek.key.fromMe) return;

        const text = body?.trim();
        if (!text) return;

        // 💬 Send user message to your ChatBot API
        const API_URL = "https://chatbot-api-key-eda9b68bbf35.herokuapp.com/api/chat";

        const res = await axios.post(API_URL, { prompt: text });

        if (res.data && res.data.reply) {
            await conn.sendMessage(from, { text: res.data.reply }, { quoted: mek });
        }

    } catch (err) {
        console.error("AI ChatBot Error:", err);
    }
});
