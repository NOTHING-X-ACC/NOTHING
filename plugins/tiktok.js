const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl", "tiktokvideo", "tttvideo"],
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

        // Input check
        if (!q) {
            return reply(
                "*AGAR AP NE TIKTOK KI VIDEO DOWNLOAD KARNI HAI 🥺💓* \n" +
                "*TO AP ESE LIKHO 😇♥️* \n\n" +
                "*TIKTOK ❮APKI TIKTOK VIDEO KA LINK❯* \n\n" +
                "*AP APNI TIKTOK VIDEO KA LINK COMMAND ❮TIKTOK❯ LIKH KER ☺️* \n" +
                "*USKE AGE APNI TIKTOK VIDEO KA LINK PASTE KAR DO 😊* \n" +
                "*TO APKI TIKTOK VIDEO DOWNLOAD KARNE KE BAAD 😍* \n" +
                "*YAHA BHEJ DE JAYE GE 🥰*"
            );
        }

        if (!q.includes("tiktok.com") && !q.includes("vt.tiktok.com")) {
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*DUBARA KOSHISH KARE 🥺 LINK Sahi Nahi Hai 😔*");
        }

        // Send waiting message
        waitMsg = await conn.sendMessage(from, { text: "*APKI TIKTOK VIDEO DOWNLOAD HO RAHI HAI ☺️*\n*JAB COMPLETE HO JAYE GE TO YAHA BHEJ DE JAYE GE 🥰*" });

        // 🔥 NEW TikWM API
        const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || data.code !== 0 || !data.data.play) {
            if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*API SE VIDEO LINK NAHI MILA 😭 DUBARA KOSHISH KAREN*");
        }

        // No watermark video link
        const videoUrl = data.data.play;

        // Caption
        const caption = "*👑 BY :❯ BILAL-MD 👑*";

        // Send video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        // delete wait msg
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });

        // Success emoji
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    } catch (e) {
        console.error("TikTok command error:", e);
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*ERROR AA GAYA 😭 DUBARA TRY KARE*");
    }
});
