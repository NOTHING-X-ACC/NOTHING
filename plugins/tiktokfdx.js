const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktokff",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🥺",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        // React to command received
        await conn.sendMessage(m.key.remoteJid, {
            reactionMessage: {
                key: m.key,
                text: "🎵"
            }
        });

        if (!q) return reply("*AGAR AP NE TIKTOK KI VIDEO DOWNLOAD KARNI HAI 🥺💓* \n*TO AP ESE LIKHO 😇♥️* \n\n*TIKTOK ❮TIKTOK VIDEO LINK❯*");

        if (!q.includes("tiktok.com")) return reply("Invalid TikTok link.");

        // Send waiting message
        let waitMsg = await reply("⏳ Video download ho rahi hai, thodi der intezar karein...");

        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            // React with ❌ if video not found
            await conn.sendMessage(m.key.remoteJid, {
                reactionMessage: {
                    key: m.key,
                    text: "❌"
                }
            });
            return reply("*APKI TIKTOK VIDEO NAHI MILI 😔*");
        }

        const { meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === "video").org;

        const caption = '*👑 BILAL-MD WHATSAPP BOT 👑*';

        // Send video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        // Delete waiting message
        await conn.sendMessage(waitMsg.key.remoteJid, { delete: waitMsg.key });

        // React to original command
        await conn.sendMessage(m.key.remoteJid, {
            reactionMessage: {
                key: m.key,
                text: "☺️"
            }
        });

    } catch (e) {
        console.error("*DUBARA KOSHISH KARE 😔*", e);
        reply(`ERROR ${e.message}`);
    }
});
