const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["gpt", "ask", "chatgpt", "bing"],
    desc: "Chat with AI using OpenAI API (via Heroku)",
    category: "AI",
    react: "🥺", // React jab command likha jaye
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        // 🥺 React on command
        await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

        // ❓ If no question given — show guidance
        if (!q) {
            const guidance = `*APKE PASS KOI SAWAL HAI 🤔 AUR APKO USKA JAWAB NAHI MIL RAHA 🥺 KIA ME APKE SAWAL KA JAWAB DHUND KE DO APKO 😇* 
*TO AP ESE LIKHO ☺️*

*GPT ❮ APKA SAWAL ❯*

*TO APKO APKE SAWAL KA JAWAB MIL JAYE GA 🥰❤️*
`;
            await reply(guidance);
            await conn.sendMessage(from, { react: { text: "🤔", key: m.key } });
            return;
        }

        // ⏳ Send waiting message
        const waitMsg = await reply("*APKE SAWAL KA JAWAB DHUNDA JA RAHA HAI...😃*");
        await conn.sendMessage(from, { react: { text: "😃", key: waitMsg.key } });

        // 🌐 Your deployed API URL
        const API_URL = "https://ai-api-key-699ac94e6fae.herokuapp.com/api/ask";

        // 🔥 Send prompt to your Heroku API
        const res = await axios.post(API_URL, { prompt: q });

        // 🧹 Delete waiting message when response comes
        try {
            await conn.sendMessage(from, { delete: waitMsg.key });
        } catch {}

        // 📩 Send AI response
        if (res.data && res.data.reply) {
            await reply(res.data.reply);
            await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
        } else {
            await reply("*APKE SAWAL KA JAWAB NAHI MILA ☹️*");
            await conn.sendMessage(from, { react: { text: "☹️", key: m.key } });
        }

    } catch (err) {
        console.error(err);
        await reply("*DUBARA KOSHISH KARE 😔*");
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    }
});
