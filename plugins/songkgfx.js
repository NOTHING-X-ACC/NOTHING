const { cmd } = require('../command');
const axios = require('axios');
const Fuse = require('fuse.js'); // fuzzy search

cmd({
    pattern: "songkgf",
    alias: ["shazam"],
    desc: "Get full song info from SHAZAM-API (with fuzzy search)",
    react: "🎵",
    category: "downloader"
}, async (conn, mek, m, { from, args, reply }) => {
    if (!args.length) return reply("⚠️ Usage: .songkgf Artist - Title");

    let text = args.join(" ");
    let parts = text.split(" - ");
    if (parts.length < 2) return reply("⚠️ Use format: Artist - Title");

    let artist = parts[0].trim();
    let title = parts[1].trim();

    try {
        // Get all tracks for artist first
        let searchRes = await axios.get(`https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=${encodeURIComponent(artist)}&t=${encodeURIComponent(title)}`);
        let tracks = searchRes.data.track;

        if (!tracks || tracks.length === 0) return reply("❌ Song not found!");

        // Fuzzy search to match closest title
        const fuse = new Fuse(tracks, { keys: ['strTrack'], threshold: 0.4 });
        let result = fuse.search(title);
        if (!result.length) return reply("❌ Song not found (fuzzy search failed)!");
        
        let info = result[0].item;

        // Build message
        let msg = `🎵 *Song:* ${info.strTrack}
👤 *Artist:* ${info.strArtist}
💽 *Album:* ${info.strAlbum}
🎼 *Genre:* ${info.strGenre || "N/A"}
😌 *Mood:* ${info.strMood || "N/A"}
⏱️ *Duration:* ${info.intDuration ? Math.floor(info.intDuration/60000) + ":" + Math.floor((info.intDuration%60000)/1000).toString().padStart(2,'0') + " min" : "N/A"}
📝 *Description:* ${info.strDescriptionEN || "No description"}
▶️ *YouTube:* ${info.strMusicVid || "N/A"}`;

        // Send message with thumbnail
        await conn.sendMessage(from, {
            image: { url: info.strTrackThumb },
            caption: msg
        }, { quoted: m });

    } catch (err) {
        console.error(err); // Termux console me error
        reply("❌ Error fetching song info.");
    }
});
