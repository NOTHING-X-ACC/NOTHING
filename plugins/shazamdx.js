const { cmd } = require('../command');
const axios = require('axios');
const stringSimilarity = require('string-similarity');

cmd({
    pattern: "shazamdx",
    alias: ["shazam"],
    desc: "🎵 Get full song info from SHAZAM-API (fuzzy search)",
    react: "🎵",
    category: "downloader"
}, async (conn, mek, m, { from, args, reply }) => {
    if (!args.length) return reply("⚠️ Usage: .shazamd Artist - Title OR just Title");

    let text = args.join(" ");
    let artist = null;
    let title = text;

    // Check if user provided Artist - Title
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
            data = res.data.success ? res.data : null;
        }

        // If no artist or exact match fails, use fuzzy search
        if (!data) {
            let searchRes;
            if (artist) {
                searchRes = await axios.get(`https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=${encodeURIComponent(artist)}&t=${encodeURIComponent(title)}`);
            } else {
                searchRes = await axios.get(`https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=&t=${encodeURIComponent(title)}`);
            }

            let tracks = searchRes.data.track;
            if (!tracks || tracks.length === 0) return reply("❌ Song not found!");

            // Fuzzy match best track
            let trackNames = tracks.map(t => t.strTrack);
            let bestMatchName = stringSimilarity.findBestMatch(title, trackNames).bestMatch.target;
            data = tracks.find(t => t.strTrack === bestMatchName);
        }

        // Build the message in Bilal MD style
        let msg = `
*🎶 Song Info - Shazam/Fuzzy Search*
─────────────────────────────
🎵 *Song:* ${data.strTrack}
👤 *Artist:* ${data.strArtist}
💽 *Album:* ${data.strAlbum}
🎼 *Genre:* ${data.strGenre || "N/A"}
😌 *Mood:* ${data.strMood || "N/A"}
⏱️ *Duration:* ${data.intDuration ? Math.floor(data.intDuration/60000) + ":" + Math.floor((data.intDuration%60000)/1000).toString().padStart(2,'0') + " min" : "N/A"}
📝 *Description:* ${data.strDescriptionEN || "No description available"}
▶️ *YouTube:* ${data.strMusicVid || "N/A"}
─────────────────────────────
💡 *Requested by:* @${m.sender.split("@")[0]}
        `;

        // Send message with thumbnail + quoted reply
        await conn.sendMessage(from, {
            image: { url: data.strTrackThumb || "https://i.imgur.com/O3DHIA5.png" },
            caption: msg,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        reply("❌ Error fetching song info.");
    }
});
