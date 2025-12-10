const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktokak47",
    alias: ["tt", "ttdl", "tiktokdl"],
    desc: "Download TikTok video",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

        if (!q) {
            return reply(
`Use format:

*tiktok <link> <option>*

1 = No Watermark  
2 = HD  
3 = Watermark`
            );
        }

        // ---- OPTION EXTRACT ----
        const optionMatch = q.match(/\b(1|2|3)\b$/);
        if (!optionMatch) {
            return reply(
`Yar option sahi do:

1 = No Watermark  
2 = HD  
3 = Watermark`
            );
        }

        const option = optionMatch[1];

        // ---- LINK EXTRACT ----
        const link = q.replace(/\b(1|2|3)\b$/, "").trim();

        if (!link.includes("tiktok.com"))
            return reply("Yar TikTok ka link sahi do.");

        reply("⏳ Video info fetch kar raha hoon...");

        // ---- API CALL ----
        const { data } = await axios.get(
            `https://delirius-apiofc.vercel.app/download/tiktok?url=${link}`
        );

        if (!data.status) return reply("API se data nahi mila.");

        const info = data.data;
        const media = info.meta.media[0];

        // ---- QUALITY SELECTION ----
        const finalUrl =
            option === "1" ? media.org :
            option === "2" ? media.hd :
            media.wm;

        // ---- CAPTION ----
        const caption =
`🎵 *TikTok Video Downloader*

👤 *User:* ${info.author.nickname} (${info.author.username})
📌 *Title:* ${info.title}

👍 Likes: ${info.like}
💬 Comments: ${info.comment}
🔁 Shares: ${info.share}

🎬 *Selected Option:* ${option}
`;

        // ---- SEND VIDEO ----
        await conn.sendMessage(
            from,
            { video: { url: finalUrl }, caption },
            { quoted: mek }
        );

    } catch (err) {
        console.log(err);
        reply("Error aa gaya yar: " + err.message);
    }
});
