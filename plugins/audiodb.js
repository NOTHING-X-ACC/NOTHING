const { cmd } = require('../command'); // apne bot command handler ke hisaab se adjust karein
const axios = require('axios');

cmd({
    pattern: 'audiodb',
    desc: 'Get song info using Shazam-AudioDB API',
    category: 'music',
    react: '🎵'
}, async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply('⚠️ Usage: .song Artist Name - Song Title\nExample: .song Coldplay - Yellow');

        // Split input into artist and title
        let [artist, title] = q.split('-').map(i => i.trim());
        if (!artist || !title) return reply('⚠️ Please provide both Artist and Song Title separated by "-"');

        // Your deployed Heroku API URL
        const API_URL = `https://shazam-song-api-2b6c6e4f4ca0.herokuapp.com/song?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`;

        // Fetch data from API
        const { data } = await axios.get(API_URL);

        if (!data.success) return reply(`❌ ${data.error || 'Song not found'}`);

        // Format response
        let msg = `🎶 *${data.song}* by *${data.artist}*\n`;
        msg += `📀 Album: ${data.album}\n`;
        msg += `🎼 Genre: ${data.genre}\n`;
        msg += `😎 Mood: ${data.mood}\n`;
        msg += `⏱ Duration: ${Math.floor(data.duration/1000)} sec\n\n`;
        msg += `📝 Description:\n${data.description}\n\n`;
        msg += `📺 YouTube: ${data.youtube}\n`;
        msg += `🖼 Thumbnail: ${data.thumbnail}`;

        // Send as reply
        reply(msg);

    } catch (err) {
        console.error(err);
        reply(`❌ Error fetching song info: ${err.message}`);
    }
});
