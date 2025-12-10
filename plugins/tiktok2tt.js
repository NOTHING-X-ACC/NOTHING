const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok2tt",
    alias: ["tt", "ttdl", "tiktokdl"],
    desc: "Download TikTok video",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {

        if (!q) {
            return reply(
`Use this format:

*tiktok <link> <option>*

1 = No Watermark  
2 = HD  
3 = Watermark

Example:
*tiktok https://vt.tiktok.com/abcde/ 1*`
            );
        }

        // OPTION LAST WORD HAY
        let option = args[args.length - 1];

        if (!["1", "2", "3"].includes(option)) {
            return reply("Yar option 1, 2, 3 me se koi aik do.");
        }

        // LINK = q se last number remove karke result
        let link = q.replace(option, "").trim();

        if (!link.includes("tiktok.com")) {
            return reply("Sahi TikTok link do yar.");
        }

        reply("⏳ Ruk ja, TikTok video fetch kar raha hoon...");

        const api = `https://delirius-apiofc.vercel.app/download/tiktok?url=${link}`;
        const { data } = await axios.get(api);

        if (!data.status) return reply("API video fetch nahi kar rahi.");

        const vid = data.data.meta.media[0];

        // VIDEO SELECT
        let finalVideo =
            option === "1" ? vid.org :
            option === "2" ? vid.hd :
            vid.wm;

        const caption =
`🎵 *TikTok Video Downloader*

👤 User: ${data.data.author.nickname}
📌 Title: ${data.data.title}

👍 Likes: ${data.data.like}
💬 Comments: ${data.data.comment}
🔁 Shares: ${data.data.share}

🎬 Selected Quality: *${option}*`;

        await conn.sendMessage(
            from,
            { video: { url: finalVideo }, caption },
            { quoted: mek }
        );

    } catch (err) {
        console.log("TT Error: ", err);
        reply("Error aa gaya yar: " + err.message);
    }
});
