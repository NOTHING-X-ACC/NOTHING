const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["gpt", "ask", "chatgpt", "bing"],
    desc: "Chat with AI using OpenAI API (via Heroku)",
    category: "AI",
    react: "☺️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*APKE PAS KOI SAWAL HAI 🤔 AUR APKO USKA JAWAB NAHI MIL RAHA 🥺 TO KIA ME APKE SAWAL KA JAWAB DHUND KAR DO 😇*\n *TO AP ESE LIKHO ☺️* \n\n *GPT ❮APKA SAWAL❯* \n*AI ❮APKA SAWAL❯* \n\n *JAB AP ESE LIKHO GE TO APKE SAWAL KA JAWAB MIL JAYE GA 😍❤️*");

        // Show typing or waiting message
        await reply("*👑 BILAL-MD INTELLIGENCE 👑*");

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
            await reply("*APKE SAWAL KA JAWAB NAHI MILA 😔*");
        }

    } catch (err) {
        console.error(err);
        await reply("❌ *Error communicating with AI server.*\nCheck logs or API status.");
    }
});
