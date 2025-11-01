const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "songkgf",
    alias: ["shazam"],
    desc: "Get full song info from SHAZAM-API with fuzzy search",
    react: "🎵",
    category: "downloader"
}, async (conn, mek, m, { from, args, q, reply }) => {

    if (!args.length) return reply("⚠️ Usage: .songkgf Song Name (Artist optional)");

    let query = args.join(" ").trim();

    try {
        // 🔹 Fuzzy search: first try Artist - Title format
        let parts = query.split(" - ");
        let artist = parts[0] ? encodeURIComponent(parts[0].trim()) : "";
        let title = parts[1] ? encodeURIComponent(parts[1].trim()) : encodeURIComponent(parts[0].trim());

        // 🔹 Fetch from SHAZAM-API (Heroku)
        let res = await axios.get(`https://shazam-song-api-2b6c6e4f4ca0.herokuapp.com/song?artist=${artist}&title=${title}`);
        let data = res.data;

        // 🔹 If not found and artist not provided, try only title
        if (!data.success && parts.length < 2) {
            let res2 = await axios.get(`https://shazam-song-api-2b6c6e4f4ca0.herokuapp.com/song?artist=&title=${title}`);
            data = res2.data;
        }

        if (!data.success) return reply("❌ Song not found!");

        // 🔹 Prepare message
        let msg = `🎵 *Song:* ${data.song}
👤 *Artist:* ${data.artist}
💽 *Album:* ${data.album}
🎼 *Genre:* ${data.genre}
😌 *Mood:* ${data.mood}
⏱️ *Duration:* ${Math.floor(data.duration / 60000)}:${Math.floor((data.duration % 60000) / 1000).toString().padStart(2,'0')} min
📝 *Description:* ${data.description}
▶️ *YouTube:* ${data.youtube}`;

        // 🔹 Send message with thumbnail
        await conn.sendMessage(from, { 
            image: { url: data.thumbnail },
            caption: msg
        }, { quoted: m });

    } catch (err) {
        console.log(err); // Termux me error dekho
        reply("❌ Error fetching song info.");
    }

});
