const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok2xd",
    alias: ["tt", "ttdl", "tiktokdl"],
    desc: "Download TikTok video",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {

        if (!args[0])
            return reply(
`Use:
*tiktok <link> <option>*

Options:
1 = No Watermark
2 = HD Video
3 = Watermark

Example:
*tiktok https://vt.tiktok.com/abc/ 1*`
            );

        let option = args[args.length - 1];  // Always last argument

        // Validate option
        if (!["1", "2", "3"].includes(option)) {
            return reply(
`Yar option sahi do:

1 = No Watermark  
2 = HD  
3 = Watermark`
            );
        }

        // Extract link (all args except last)
        let link = args.slice(0, -1).join(" ");

        if (!link.includes("tiktok.com"))
            return reply("Yar sahi TikTok link do.");

        reply("⏳ Video download ho rahi hai, ruk ja...");

        // API Call
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${link}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status)
            return reply("Video fetch nahi ho rahi API se.");

        const video = data.data.meta.media[0];

        // Pick quality
        let finalVideo =
            option === "1" ? video.org :
            option === "2" ? video.hd :
            video.wm;

        const caption =
`🎵 *TikTok Video Downloader*

👤 User: ${data.data.author.nickname}
📌 Title: ${data.data.title}

👍 Likes: ${data.data.like}
💬 Comments: ${data.data.comment}
🔁 Shares: ${data.data.share}

🎬 Option: *${option}*`;

        await conn.sendMessage(
            from,
            { video: { url: finalVideo }, caption },
            { quoted: mek }
        );

    } catch (err) {
        console.error("TT Error:", err);
        reply("Error aa gaya yar: " + err.message);
    }
});
