const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "songk",
    alias: ["shazam"],
    desc: "Get song info from SHAZAM-API",
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

        let msg = `🎵 *Song:* ${data.song}\n👤 *Artist:* ${data.artist}\n💽 *Album:* ${data.album}\n🎼 *Genre:* ${data.genre}`;

        // Send text + react
        reply(msg); // simple reply

    } catch (err) {
        console.log(err);       // Termux console me dekho
        reply("❌ Error fetching song info.");
    }
});
