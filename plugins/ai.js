const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["gpt", "chatgpt", "askai"],
    desc: "Ask any question from AI",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("💬 *Please enter a question to ask the AI.*\n\nExample: `.ai What is JavaScript?`");

        let wait = await reply("🧠 Thinking...");
        const response = await axios.get(`https://lance-frank-asta.onrender.com/api/ai?q=${encodeURIComponent(q)}`);

        if (response.data && response.data.result) {
            await conn.sendMessage(from, { text: `🤖 *AI Reply:*\n\n${response.data.result}` }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { text: "⚠️ AI didn’t return a valid response. Try again later." }, { quoted: mek });
        }

    } catch (e) {
        console.error(e);
        reply("❌ *Error:* Unable to connect to AI API.\nCheck your internet or API link.");
    }
});
