const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok2tiktok",
    alias: ["tt", "ttdl", "tiktokdl"],
    desc: "Download TikTok video with options",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (args.length < 2)
            return reply(
`Yar command format ye hai:

*tiktok <link> <option>*

1 = No Watermark  
2 = HD  
3 = Watermark

Example:
*tiktok https://vt.tiktok.com/abc/ 1*`
            );

        let url = args[0];
        let option = args[1];

        if (!url.includes("tiktok.com"))
            return reply("Yar sahi TikTok link send karo.");

        if (!["1", "2", "3"].includes(option))
            return reply("Option sirf 1, 2, 3 valid hain.");

        reply("⏳ Ruk ja yar, video le raha hoon...");

        // Fetch API data
        const api = `https://delirius-apiofc.vercel.app/download/tiktok?url=${url}`;
        const res = await axios.get(api);

        if (!res.data.status) return reply("API se video nahi mili.");

        const data = res.data.data;
        const media = data.meta.media[0];

        // Choose video quality
        let finalVideo;
        if (option === "1") finalVideo = media.org;
        if (option === "2") finalVideo = media.hd;
        if (option === "3") finalVideo = media.wm;

        const caption =
`🎵 *TikTok Video Downloader*

👤 User: ${data.author.nickname}
📄 Title: ${data.title}

👍 Likes: ${data.like}
💬 Comments: ${data.comment}
🔁 Shares: ${data.share}

🎬 Selected Option: *${option}*`;

        // Send video
        await conn.sendMessage(
            from,
            { video: { url: finalVideo }, caption },
            { quoted: mek }
        );

    } catch (err) {
        console.error("TikTok CMD Error:", err);
        reply("Yar error aa gaya: " + err.message);
    }
});
