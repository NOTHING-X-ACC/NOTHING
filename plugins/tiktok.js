const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    let waitMsg;
    try {
        // React 🥺
        await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });

        // Agar user ne link nahi diya
        if (!q) {
            return reply(
                `*AGAR AP NE TIKTOK KI VIDEO DOWNLOAD KARNI HAI 🥺💓* \n\n` +
                `*TO AP ESE LIKHO 😇♥️* \n\n` +
                `> *TIKTOK <APKI TIKTOK VIDEO KA LINK>* \n\n` +
                `*EXAMPLE:* \n.tiktok https://www.tiktok.com/@username/video/1234567890`
            );
        }

        // Agar galat link diya gaya hai
        if (!q.includes("tiktok.com")) {
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*DUBARA KOSHISH KARE 🥺 — VALID TikTok LINK DEEJIYE!*");
        }

        // Wait message bhejna
        waitMsg = await conn.sendMessage(from, { text: "*APKI TIKTOK VIDEO DOWNLOAD HO RAHI HAI ☺️*\n*KUCH DER INTEZAR KARE 🥰*" });

        // API CALL — working endpoint
        const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.video || !data.video.noWatermark) {
            if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*❌ DOWNLOAD FAIL — DUBARA KOSHISH KARE 🥺*");
        }

        const videoUrl = data.video.noWatermark;
        const caption = "*👑 BY :❯ BILAL-MD 👑*";

        // Send video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        // Delete wait msg
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });

        // Success react
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    } catch (e) {
        console.error("❌ TikTok command error:", e);
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*❌ ERROR: DUBARA KOSHISH KARE 🥺*");
    }
});
