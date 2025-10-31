const { cmd } = require('../command'); // Bot command handler
const axios = require('axios');

cmd({
    pattern: 'tiktokeds',
    alias: ['ttdl', 'tt', 'tiktokdl'],
    desc: 'Download TikTok video without watermark',
    category: 'downloader',
    react: '🎵',
    filename: __filename
},
async (conn, m, args, extra) => {
    const { from, reply } = m;

    if (!args || !args[0]) return reply('*⚠️ Usage:* .tiktok <TikTok Video URL>');

    const videoUrl = args[0];
    const apiKey = '09684026b789959d624f0cb3ef7e5e5fb84097b2b5640ea3365edcdd879cd7fc'; // aapki API key
    const endpoint = 'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/tiktok/download';

    // Waiting message
    const waitMsg = await conn.sendMessage(from, { text: '⏳ Downloading TikTok video...' }, { quoted: m });

    try {
        const response = await axios.get(endpoint, {
            params: { url: videoUrl, apiKey: apiKey },
            timeout: 20000
        });

        if (!response.data || !response.data.video) {
            const errorMsg = '❌ Failed to fetch video. Check URL or API key.';
            console.error(errorMsg, response.data);
            return conn.sendMessage(from, { text: `${errorMsg}\n\nConsole Info:\n${JSON.stringify(response.data, null, 2)}` }, { quoted: m });
        }

        const videoLink = response.data.video;

        await conn.sendMessage(
            from,
            { video: { url: videoLink }, caption: '🎵 TikTok Downloaded ✅' },
            { quoted: m }
        );

        await conn.sendMessage(from, { text: '✅ Download complete!' }, { quoted: m });

    } catch (err) {
        console.error('TikTok Download Error:', err.message);
        await conn.sendMessage(
            from,
            { text: `❌ Error downloading TikTok video.\n\nConsole Error:\n${err.message}` },
            { quoted: m }
        );
    }

    // Delete waiting message
    try {
        await conn.sendMessage(from, { delete: waitMsg.key });
    } catch (e) { /* ignore if cannot delete */ }
});
