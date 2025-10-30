const axios = require('axios');
const { sms } = require('./sms'); // aapka sms module

cmd({
    pattern: 'tiktok1x4',
    desc: 'Download TikTok video via custom API',
    category: 'downloader',
    react: '🎵',
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    if (!args[0]) return reply('Please provide TikTok URL!');
    const url = args[0];

    try {
        // 1️⃣ Call your custom TikTok API
        const apiRes = await axios.post('https://tiktokapikey-795e60b7ebb1.herokuapp.com/api/tiktok', {
            url: url
        });

        if (!apiRes.data || !apiRes.data.videoUrl) return reply('Failed to get video!');

        const videoUrl = apiRes.data.videoUrl;

        // 2️⃣ Download video as buffer
        const videoBuffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });

        // 3️⃣ Send video to WhatsApp
        await conn.sendMessage(from, { video: Buffer.from(videoBuffer.data), caption: 'Here is your TikTok video!' }, { quoted: m });

    } catch (err) {
        console.error(err);
        reply('Error downloading TikTok video.');
    }
});
