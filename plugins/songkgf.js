const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "songkgf",
    alias: ["shazam"],
    desc: "Get full song info from SHAZAM-API",
    react: "🎵",
    category: "downloader"
}, async (conn, mek, m, { from, args, q, reply }) => {
    if (!args.length) return reply("⚠️ Usage: .song Artist - Title");

    let text = args.join(" ");
    let parts = text.split(" - ");
    if (parts.length < 2) return reply("⚠️ Use format: Artist - Title");

    let artist = encodeURIComponent(parts[0].trim());
    let title = encodeURIComponent(parts[1].trim());

    try {
        let res = await axios.get(`https://shazam-song-api-2b6c6e4f4ca0.herokuapp.com/song?artist=${artist}&title=${title}`);
        let data = res.data;

        if (!data.success) return reply("❌ Song not found!");

        let msg = `🎵 *Song:* ${data.song}
👤 *Artist:* ${data.artist}
💽 *Album:* ${data.album}
🎼 *Genre:* ${data.genre}
😌 *Mood:* ${data.mood}
⏱️ *Duration:* ${Math.floor(data.duration / 60000)}:${Math.floor((data.duration % 60000) / 1000).toString().padStart(2,'0')} min
📝 *Description:* ${data.description}
▶️ *YouTube:* ${data.youtube}`;

        // Send message with thumbnail
        await conn.sendMessage(from, { 
            image: { url: data.thumbnail },
            caption: msg
        }, { quoted: m });

    } catch (err) {
        console.log(err); // Termux me error dekho
        reply("❌ Error fetching song info.");
    }
});
