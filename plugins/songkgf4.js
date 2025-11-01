const { cmd } = require('../command');
const axios = require('axios');
const stringSimilarity = require('string-similarity');

cmd({
    pattern: "songkgf4",
    alias: ["shazam"],
    desc: "Get full song info from SHAZAM-API (fuzzy search)",
    react: "🎵",
    category: "downloader"
}, async (conn, mek, m, { from, args, reply }) => {
    if (!args.length) return reply("⚠️ Usage: .songkgf Artist - Title OR just Title");

    let text = args.join(" ");
    let artist = null;
    let title = text;

    // Check if user provided Artist - Title format
    if (text.includes(" - ")) {
        let parts = text.split(" - ");
        artist = parts[0].trim();
        title = parts[1].trim();
    }

    try {
        let data;

        if (artist) {
            // Exact match with artist + title
            const res = await axios.get(`https://shazam-song-api-2b6c6e4f4ca0.herokuapp.com/song?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
            data = res.data;
        }

        // If no artist, or exact match fails, use fuzzy search
        if (!data || !data.success) {
            // Search by artist or title only in AudioDB
            let searchRes;
            if (artist) {
                searchRes = await axios.get(`https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=${encodeURIComponent(artist)}&t=${encodeURIComponent(title)}`);
            } else {
                // Fallback: search artist by title only
                searchRes = await axios.get(`https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=&t=${encodeURIComponent(title)}`);
            }

            let tracks = searchRes.data.track;
            if (!tracks) return reply("❌ Song not found!");

            // Use string similarity to find best match
            let trackNames = tracks.map(t => t.strTrack);
            let bestMatchName = stringSimilarity.findBestMatch(title, trackNames).bestMatch.target;
            data = tracks.find(t => t.strTrack === bestMatchName);
            data.success = true;
        }

        // Prepare message
        let msg = `🎵 *Song:* ${data.strTrack}
👤 *Artist:* ${data.strArtist}
💽 *Album:* ${data.strAlbum}
🎼 *Genre:* ${data.strGenre}
😌 *Mood:* ${data.strMood || "N/A"}
⏱️ *Duration:* ${Math.floor((data.intDuration||0) / 60000)}:${Math.floor(((data.intDuration||0) % 60000) / 1000).toString().padStart(2,'0')} min
📝 *Description:* ${data.strDescriptionEN || "N/A"}
▶️ *YouTube:* ${data.strMusicVid || "N/A"}`;

        await conn.sendMessage(from, { 
            image: { url: data.strTrackThumb || "https://i.imgur.com/O3DHIA5.png" },
            caption: msg
        }, { quoted: m });

    } catch (err) {
        console.log(err);
        reply("❌ Error fetching song info.");
    }
});
