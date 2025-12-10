const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktokab",
    alias: ["ttdl", "tt"],
    desc: "Download TikTok video with minimal info",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    if (!q) return reply("Yar TikTok ka link do 🙂");

    try {
        reply("⏳ Video info fetch kar raha hoon…");

        // API call
        const api = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(api);

        if (!data.status) return reply("API se video info nahi mili.");

        const info = data.data;
        const video = info.meta.media[0];

        // Minimal Info Caption
        const caption =
`🎵 TikTok Video

📄 Title: ${info.title}
👤 Author: ${info.author.nickname}`;

        // Send info first
        await reply(caption);

        // Then send HD No-Watermark video
        await conn.sendMessage(
            from,
            {
                video: { url: video.hd || video.org },
                caption: "🎥 HD No-Watermark Video"
            },
            { quoted: mek }
        );

    } catch (err) {
        console.log(err);
        reply("❌ Video fetch nahi ho rahi, link check karo 🙏");
    }
});
