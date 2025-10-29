const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark (Saviya-Kolla API)",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    let waitMsg;
    try {
        // Initial reaction
        await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });

        if (!q) return reply(
            "*❌ Please provide a TikTok video link!*\n\nExample:\n```.tiktok https://www.tiktok.com/@username/video/123456789```"
        );

        if (!q.includes("tiktok.com")) {
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*⚠️ Invalid TikTok link! Please check and try again.*");
        }

        // Waiting message
        waitMsg = await conn.sendMessage(from, { text: "*📥 Downloading your TikTok video... Please wait 😇*" });

        // 🧠 API call (Saviya-Kolla only)
        const api = `https://saviya-kolla-api.koyeb.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(api);

        const videoUrl = data?.video || data?.result?.video || data?.data?.play;
        if (!videoUrl) {
            if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("⚠️ TikTok download temporarily unavailable.\nPlease try again later 🥺");
        }

        // 🎬 Send video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `*👑 BY: BILAL-MD 👑*\n\n✅ Source: *Saviya-Kolla API*`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        // Cleanup + react
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    } catch (e) {
        console.error("TikTok command error:", e);
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*⚠️ Something went wrong. Please try again later 🥺*");
    }
});
