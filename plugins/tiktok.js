const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark (multi-fallback)",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    let waitMsg;
    try {
        await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });

        if (!q) return reply(
            "*❌ Please provide a TikTok video link!*\n\nExample:\n```.tiktok https://www.tiktok.com/@username/video/123456789```"
        );

        if (!q.includes("tiktok.com")) {
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*⚠️ Invalid TikTok link! Please check and try again.*");
        }

        waitMsg = await conn.sendMessage(from, { text: "*📥 Downloading your TikTok video... Please wait 😇*" });

        let videoUrl;

        // ========== 1️⃣ Primary API ==========
        try {
            const api1 = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
            const { data } = await axios.get(api1);
            if (data?.status && data?.data?.meta?.media) {
                videoUrl = data.data.meta.media.find(v => v.type === "video")?.org;
                console.log("✅ Source: Delirius API");
            }
        } catch (err) {
            console.log("❌ Delirius API failed:", err.message);
        }

        // ========== 2️⃣ Fallback API ==========
        if (!videoUrl) {
            try {
                const api2 = `https://itzpire.com/download/tiktok?url=${q}`;
                const { data } = await axios.get(api2);
                if (data?.data?.play) {
                    videoUrl = data.data.play;
                    console.log("✅ Source: ItzPire API");
                } else if (data?.result?.video) {
                    videoUrl = data.result.video;
                    console.log("✅ Source: ItzPire API (alt key)");
                }
            } catch (err) {
                console.log("❌ ItzPire API failed:", err.message);
            }
        }

        // ========== 3️⃣ Last Fallback (Lance France) ==========
        if (!videoUrl) {
            try {
                const api3 = `https://lance-frank-asta.onrender.com/api/downloader?url=${q}`;
                const { data } = await axios.get(api3);
                if (data?.result?.video || data?.video?.url || data?.url) {
                    videoUrl = data.result?.video || data.video?.url || data.url;
                    console.log("✅ Source: Lance France API");
                }
            } catch (err) {
                console.log("❌ Lance France API failed:", err.message);
            }
        }

        // If all fail
        if (!videoUrl) {
            if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("⚠️ TikTok download temporarily unavailable.\nPlease try again later 🥺");
        }

        // Send video finally 🎬
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: "*👑 BY: BILAL-MD 👑*",
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    } catch (e) {
        console.error("TikTok command error:", e);
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*⚠️ Something went wrong. Please try again later 🥺*");
    }
});
