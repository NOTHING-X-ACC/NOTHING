const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["bot", "white", "gptxd", "gpt4", "bing"],
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

        if (!data || !data.answer) {
            await react("❌");
            return reply("⚠️ AI failed to respond. Please try again later.");
        }

        await reply(`🤖 *BILAL-MD AI Response:*\n\n${data.answer}`);
        await react("✅");
    } catch (e) {
        console.error("Error in AI command:", e);
        await react("❌");
        reply("❌ Error occurred while communicating with the AI API.");
    }
});
