const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["bot", "white", "gptf4", "gpt4", "bing"],
    desc: "Chat with an AI model",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("💬 Please provide a message for the AI.\nExample: `.ai What is JavaScript?`");

        const apiUrl = `https://saviya-kolla-api.koyeb.app/ai/saviya-ai?query=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        // API ke possible response keys
        const aiReply = data.answer || data.result || data.message || data.response || null;

        if (!aiReply) {
            await react("❌");
            return reply("⚠️ AI didn’t return any reply. Try again later or check API link.");
        }

        await react("✅");
        await reply(`🤖 *BILAL-MD AI Response:*\n\n${aiReply}`);
    } catch (e) {
        console.error("Error in AI command:", e.message || e);
        await react("❌");
        reply("❌ Error: Unable to reach the AI API. Maybe it's down or returned invalid data.");
    }
});
