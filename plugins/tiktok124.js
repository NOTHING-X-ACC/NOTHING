const axios = require('axios');

const { cmd } = require('../command');

cmd({
    pattern: 'tiktok124',
    desc: 'Download TikTok video using custom API',
    category: 'downloader',
    react: '🎵',
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
    if (!q) return reply('Please provide a TikTok link!');

    try {
        // 1️⃣ Call your custom API
        const apiUrl = 'https://tiktokapikey-795e60b7ebb1.herokuapp.com/api/tiktok';
        const response = await axios.post(apiUrl, { url: q });
        const data = response.data;

        if (!data || !data.videoUrl) return reply('Failed to fetch TikTok video!');

        // 2️⃣ Download the video as buffer
        const videoBuffer = await axios.get(data.videoUrl, { responseType: 'arraybuffer' });

        // 3️⃣ Send video to WhatsApp
        await conn.sendMessage(from, { video: videoBuffer.data, caption: 'Here is your TikTok video!' }, { quoted: m });

    } catch (err) {
        console.error(err);
        reply('❌ Error while downloading TikTok video!');
    }
});
