const { cmd } = require('../command'); // Adjust path if needed
const axios = require('axios');

cmd({
    pattern: "songd",
    alias: ["shazam"],
    desc: "Get song info from SHAZAM-API (AudioDB)",
    react: "🎵",
    category: "downloader"
}, async (conn, mek, m, { from, args, q, reply }) => {
    if (!args[0]) return reply("⚠️ Usage: .song Artist - Title\nExample: .song Coldplay - Yellow");

    // Join args to form artist and title
    let text = args.join(" ");
    let parts = text.split(" - ");
    if (parts.length < 2) return reply("⚠️ Use format: Artist - Title");

    let artist = encodeURIComponent(parts[0].trim());
    let title = encodeURIComponent(parts[1].trim());

    try {
        let res = await axios.get(`https://shazam-song-api-2b6c6e4f4ca0.herokuapp.com/song?artist=${artist}&title=${title}`);
        let data = res.data;

        if (!data.success) return reply("❌ Song not found!");

        let msg = `🎵 *Song:* ${data.song}\n👤 *Artist:* ${data.artist}\n💽 *Album:* ${data.album}\n🎼 *Genre:* ${data.genre}`;

        // Send thumbnail with message
        conn.sendMessage(from, { 
            image: { url: data.thumbnail }, 
            caption: msg 
        }, { quoted: m });

    } catch (err) {
        console.log(err);
        reply("❌ Error fetching song info.");
    }
});
