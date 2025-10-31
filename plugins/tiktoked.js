const { cmd } = require('../command'); // bot ka command handler
const axios = require('axios');

cmd({
    pattern: 'tiktoked',
    alias: ['ttdl', 'tt', 'tiktokdl'],
    desc: 'Download TikTok video without watermark',
    category: 'downloader',
    react: '🎵',
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    if (!args[0]) return reply('*⚠️ Usage:* .tiktok <TikTok Video URL>');

    const videoUrl = args[0];
    const apiKey = '09684026b789959d624f0cb3ef7e5e5fb84097b2b5640ea3365edcdd879cd7fc'; // ✅ aapki API key
    const endpoint = 'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/tiktok/download';

    let waitMsg = await reply('⏳ Downloading TikTok video...');

    try {
        const response = await axios.get(endpoint, {
            params: { url: videoUrl, apiKey: apiKey },
            timeout: 20000
        });

        // API se video link check karo
        if (!response.data || !response.data.video) {
            return reply('❌ Failed to fetch video. Please check the URL or API key.');
        }

        const videoLink = response.data.video;
        await conn.sendMessage(from, { video: { url: videoLink }, caption: '🎵 TikTok Downloaded ✅' }, { quoted: m });
        await conn.sendMessage(from, { text: '✅ Download complete!' }, { quoted: m });

    } catch (err) {
        console.error(err);
        await reply('❌ Error downloading TikTok video. Try again later.');
    }

    // Waiting message delete kar do
    await conn.sendMessage(from, { delete: waitMsg.key });
});
