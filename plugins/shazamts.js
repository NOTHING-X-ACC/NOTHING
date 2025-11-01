const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
    pattern: 'shazamts',
    alias: ['shazam'],
    desc: 'Recognise song from audio snippet',
    category: 'music',
    react: '😃',
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

        // Call deployed Shazam API
        const apiURL = 'https://shazam-api2-c700860d2012.herokuapp.com/detect';
        const response = await axios.post(apiURL, form, { headers: form.getHeaders() });

        // DEBUG: Send full API response (optional, comment out after testing)
        // await conn.sendMessage(m.from, { text: 'API Response:\n' + JSON.stringify(response.data, null, 2) }, { quoted: m });

        // Safe parsing
        const track = response.data.data?.track || {};
        const title = track.title || "N/A";
        const artist = track.subtitle || "N/A";
        const album = track.sections?.[0]?.metadata?.[0]?.text || "N/A";

        // Send info in Bilal MD / Shaban MD style
        const caption = `👑 *BILAL-MD / SHABAN-MD SONG DETECTOR* 👑\n\n` +
                        `🎶 *Title:* ${title}\n` +
                        `🎤 *Artist:* ${artist}\n` +
                        `💿 *Album:* ${album}`;

        await conn.sendMessage(m.from, { text: caption }, { quoted: m });

    } catch (err) {
        console.error('Shazam API Error:', err.message);
        await conn.sendMessage(m.from, { text: `❌ Could not recognise song.\nError: ${err.message}` }, { quoted: m });
    }
});
