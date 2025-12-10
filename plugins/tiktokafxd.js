const { cmd } = require('../command');
const axios = require('axios');

let tiktokSession = {};  // store user session

cmd({
    pattern: "tiktokafxd",
    alias: ["tt", "tiktokdl"],
    desc: "Fetch TikTok video info",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Yar TikTok ka link do.");

        if (!q.includes("tiktok.com"))
            return reply("Sahi link do TikTok ka.");

        reply("⏳ Ruk ja info le raha hoon...");

        const api = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(api);

        if (!data.status) return reply("API error, video nahi mili.");

        let res = data.data;

        // save session
        tiktokSession[m.sender] = res;

        let msg =
`🎵 *TikTok Video Info* 🎵

👤 User: ${res.author.nickname} (${res.author.username})
📌 Title: ${res.title}

👍 Likes: ${res.like}
💬 Comments: ${res.comment}
🔁 Shares: ${res.share}

🔽 Choose Format:
1 = No Watermark
2 = HD
3 = Watermark

👉 Reply with *1*, *2* or *3*`;

        reply(msg);

    } catch (e) {
        reply("Error: " + e.message);
    }
});


// SECOND COMMAND — USER SENDS 1/2/3
cmd({
    pattern: "1|2|3",
    desc: "Send selected TikTok quality",
    category: "downloader",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, match, reply }) => {
    try {
        let option = match[0];

        if (!tiktokSession[m.sender])
            return reply("Pehle TikTok link do yar.");

        let info = tiktokSession[m.sender];
        let media = info.meta.media[0];

        let finalVideo =
            option === "1" ? media.org :
            option === "2" ? media.hd :
            media.wm;

        let caption =
`🎬 *Selected Option:* ${option}

📌 Title: ${info.title}
👤 User: ${info.author.nickname}

Enjoy 🔥`;

        await conn.sendMessage(from, {
            video: { url: finalVideo },
            caption
        }, { quoted: mek });

        delete tiktokSession[m.sender]; // clear session

    } catch (e) {
        reply("Error: " + e.message);
    }
});
