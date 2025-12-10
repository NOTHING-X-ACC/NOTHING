const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktokabx",
    alias: ["ttdl", "tt"],
    desc: "Download TikTok video with minimal info",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    if (!q) return reply("AP NE KOI TIKTOK VIDEO DOWNLOAD KARNI HAI 🤔 TO AP US TIKTOK VIDEO KA LINK COPY KAR LO 😇*\n*AUR PHIR ESE LIKHO ☺️*\n\n*TIKTOK ❮ VIDEO LINK ❯* \n *JAB AP ESE LIKHO GE TO APKI TIKTOK VIDEO 😍 DOWNLOAD KAR KE YAHA PER BHEJ DE JAYE GE 🥰♥️*");

    try {
        reply("*👑 BILAL-MD TIKTOK 👑*");

        // API call
        const api = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(api);

        if (!data.status) return reply("*APKO TIKTOK VIDEO NAHI MILI 😔*");

        const info = data.data;
        const video = info.meta.media[0];

        // Minimal Info Caption
        const caption =
`*👑 TIKTOK VIDEO INFO 👑*

*👑 VIDEO NAME 👑*
${info.title}

*👑 TIKTOK ID NAME 👑* 
 *👑 ${info.author.nickname} 👑*`;

        // Send info first
        await reply(caption);

        // Then send HD No-Watermark video
        await conn.sendMessage(
            from,
            {
                video: { url: video.hd || video.org },
                caption: "*👑 BY :❯ BILAL-MD 👑*"
            },
            { quoted: mek }
        );

    } catch (err) {
        console.log(err);
        reply("*APKI TIKTOK VIDEO NAHI MILI 😔*");
    }
});
