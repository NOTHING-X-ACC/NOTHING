
const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktokuf",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("*AGAR AP NE TIKTOK KI VIDEO DOWNLOAD KARNI HAI 🥺💓* \n *TO AP ESE LIKHO 😇♥️* \n \n *TIKTOK ❮TIKTOK VIDEO LINK❯* \n\n *AP APNI TIKTOK VIDEO KA LINK COMMAND ❮TIKTOK❯ LIKH KER ☺️* \n *USKE AGE APNI TIKTOK VIDEO KA LINK PASTE KAR DO 😊* \n *TO APKI TIKTOK VIDEO DOWNLOAD KARNE KE BAAD 😍* \n *YAHA BHEJ DE JAYE GE 🥰*");
        if (!q.includes("tiktok.com")) return reply("Invalid TikTok link.");
        
        reply("Downloading video, please wait...");
        
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data) return reply("*APKI TIKTOK VIDEO NAHI MILI 😔*");
        
        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === "video").org;
        
        const caption = '*👑 BILAL-MD WHATSAPP BOT 👑*';
        
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
    } catch (e) {
        console.error("*DUBARA KOSHISH KARE 😔*", e);
        reply(`ERROR ${e.message}`);
    }
});
          
