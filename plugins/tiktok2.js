const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok2",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    let waitMsg;
    try {
        // React command msg 🥺
        await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });

        if (!q) return reply(
            "*AGAR AP NE TIKTOK KI VIDEO DOWNLOAD KARNI HAI 🥺💓* \n" +
            "*TO AP ESE LIKHO 😇♥️* \n\n" +
            "*TIKTOK ❮APKI TIKTOK VIDEO KA LINK❯* \n\n" +
            "*AP APNI TIKTOK VIDEO KA LINK COMMAND ❮TIKTOK❯ LIKH KER ☺️* \n" +
            "*USKE AGE APNI TIKTOK VIDEO KA LINK PASTE KAR DO 😊* \n" +
            "*TO APKI TIKTOK VIDEO DOWNLOAD KARNE KE BAAD 😍* \n" +
            "*YAHA BHEJ DE JAYE GE 🥰*"
        );

        if (!q.includes("tiktok.com")) {
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*DUBARA KOSHISH KARE 🥺*");
        }

        // Send waiting message
        waitMsg = await conn.sendMessage(from, { text: "*APKI TIKTOK VIDEO DOWNLOAD HO RAHI HAI ☺️*\n*JAB DOWNLOAD COMPLETE HO JAYE GE TO YAHA BHEJ DE JAYE GE 🥰*" });

        // ✅ Updated API URL
        const apiUrl = `https://lance-frank-asta.onrender.com/api/downloader?url=${q}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.result || !data.result.video) {
            if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*DUBARA KOSHISH KARE 🥺 API SE DATA NHI MILA 😔*");
        }

        const videoUrl = data.result.video; // 👈 API ke response ke hisaab se adjust
        const caption = "*👑 BY :❯ BILAL-MD 👑*";

        // Send video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        // Delete waiting msg
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });

        // React command msg after success ☺️
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    } catch (e) {
        console.error("TikTok command error:", e);
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*DUBARA KOSHISH KARE 🥺*");
    }
});
