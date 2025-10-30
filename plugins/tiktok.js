const { cmd } = require('../command'); // tumhare command handler
const axios = require('axios');

cmd({
    pattern: 'tiktok',
    desc: 'Download TikTok video using custom API',
    category: 'downloader',
    react: '🎵',
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
    if (!q) return reply('Please provide a TikTok link! Example: .tiktok https://vt.tiktok.com/...');

    try {
        // Call custom API
        const apiUrl = 'https://tiktokapikey-795e60b7ebb1.herokuapp.com/api/tiktok';
        const response = await axios.post(apiUrl, { url: q });
        const data = response.data;

        if (!data || !data.videoUrl) return reply('Failed to fetch TikTok video!');

        // Send video to WhatsApp
        await conn.sendMessage(from, { video: { url: data.videoUrl }, caption: 'Here is your TikTok video!' }, { quoted: m });

    } catch (err) {
        console.error(err);
        reply('❌ Error while downloading TikTok video!');
    }
});
