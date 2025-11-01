const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
    pattern: 'shazamtest',
    alias: ['shazam'],
    desc: 'Recognise song from audio snippet',
    category: 'music',
    react: '🎵',
    filename: __filename
},
async (conn, mek, m) => {
    try {
        // Check if user replied to audio
        if (!m.quoted || !m.quoted.audio) 
            return m.reply('*⚠️ Reply to an audio snippet!*');

        // Download audio from WhatsApp
        const audioBuffer = await conn.downloadMediaMessage(m.quoted);

        // Prepare FormData
        const form = new FormData();
        form.append('audio', audioBuffer, { filename: 'song.mp3' });

        // Call your deployed Shazam API
        const apiURL = 'https://shazam-api2-c700860d2012.herokuapp.com/detect';
        const response = await axios.post(apiURL, form, { headers: form.getHeaders() });

        const track = response.data.data.track;

        // Send info in Bilal MD / Shaban MD style
        const caption = `👑 *BILAL-MD / SHABAN-MD SONG DETECTOR* 👑\n\n` +
                        `🎶 *Title:* ${track.title}\n` +
                        `🎤 *Artist:* ${track.subtitle}\n` +
                        `💿 *Album:* ${track.sections?.[0]?.metadata?.[0]?.text || 'N/A'}`;

        await conn.sendMessage(m.from, { text: caption }, { quoted: m });

    } catch (err) {
        console.error('Shazam API Error:', err.message);
        await conn.sendMessage(m.from, { text: `❌ Could not recognise song.\nError: ${err.message}` }, { quoted: m });
    }
});
