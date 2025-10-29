const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["bot", "white", "gptxd", "gpt4x", "bing"],
    desc: "Chat with an AI model using Gifted API",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("💬 Please provide a message for the AI.\nExample: `.ai What is JavaScript?`");

        const apiUrl = `https://api.giftedtech.co.ke/api/ai/ai?apikey=gifted&query=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl, { timeout: 15000 }); // 15s safety timeout

        // API ke possible response fields
        const aiReply = data.answer || data.result || data.message || data.response || null;

        if (!aiReply || typeof aiReply !== 'string' || aiReply.trim() === '') {
            await react("❌");
            return reply("⚠️ AI failed to generate a response. Try again later or check API status.");
        }

        await react("✅");
        await reply(`🤖 *BILAL-MD AI Response:*\n\n${aiReply}`);
    } catch (e) {
        console.error("Error in AI command:", e.message || e);
        await react("❌");
        reply("❌ *Error:* Unable to connect to Gifted AI API. Please try again later.");
    }
});
