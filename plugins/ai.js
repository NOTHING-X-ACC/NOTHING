const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["gpt", "ask", "chatgpt"],
    desc: "Chat with AI using OpenAI API (via Heroku)",
    category: "AI",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please enter a question or message.*\n\nExample:\n.ai Who made you?");

        // Show typing or waiting message
        await reply("⏳ *AI thinking... please wait*");

        // 🔗 Your working API URL
        const API_URL = "https://ai-api-key-699ac94e6fae.herokuapp.com/api/ask";

        // 🧠 Send the user's question to your Heroku AI API
        const res = await axios.post(API_URL, {
            prompt: q
        });

        // 📩 Handle and send the response
        if (res.data && res.data.reply) {
            await reply(res.data.reply);
        } else {
            await reply("⚠️ *No reply received from AI server.*");
        }

    } catch (err) {
        console.error(err);
        await reply("❌ *Error communicating with AI server.*\nCheck logs or API status.");
    }
});
