const { cmd } = require('../command'); // aapke command loader ka path
const axios = require('axios');

cmd({
    pattern: "ttxd",
    alias: ["tt", "ttdl", "tiktokdl"],
    desc: "Download TikTok video via custom API",
    category: "downloader",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!args[0]) {
            return reply("❌ Please provide a TikTok video URL!\nUsage: .tiktok <video_url>");
        }

        const tiktokUrl = args[0];
        const apiKey = 'BilalTech05'; // aapki Koyeb API key
        const apiEndpoint = `https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/tiktok/download?apiKey=${apiKey}&url=${encodeURIComponent(tiktokUrl)}`;

        // API call
        const response = await axios.get(apiEndpoint);
        if (!response.data || !response.data.videoUrl) {
            return reply("❌ Failed to fetch video from API.");
        }

        const videoLink = response.data.videoUrl;

        // Send video as a message
        await conn.sendMessage(from, {
            video: { url: videoLink },
            caption: "Here is your TikTok video!"
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("❌ Error occurred while downloading TikTok video.");
    }
});
