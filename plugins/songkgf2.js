const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "songkgf2",
    alias: ["shazam"],
    desc: "Get full song info from SHAZAM-API using only song name",
    react: "🎵",
    category: "downloader"
}, async (conn, mek, m, { from, args, q, reply }) => {
    if (!args.length) return reply("⚠️ Usage: .songkgf Song Name");

    let songName = encodeURIComponent(args.join(" ").trim());

    try {
        // Use searchtrack.php from AudioDB
        let res = await axios.get(`https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=&t=${songName}`);
        let data = res.data;

        if (!data.track || data.track.length === 0) return reply("❌ Song not found!");

        let info = data.track[0];

        let msg = `🎵 *Song:* ${info.strTrack}
👤 *Artist:* ${info.strArtist}
💽 *Album:* ${info.strAlbum}
🎼 *Genre:* ${info.strGenre || 'N/A'}
😌 *Mood:* ${info.strMood || 'N/A'}
⏱️ *Duration:* ${info.intDuration ? Math.floor(info.intDuration/60000)+':'+Math.floor((info.intDuration%60000)/1000).toString().padStart(2,'0')+' min' : 'N/A'}
📝 *Description:* ${info.strDescriptionEN || 'N/A'}
▶️ *YouTube:* ${info.strMusicVid || 'N/A'}`;

        // Send message with thumbnail
        await conn.sendMessage(from, { 
            image: { url: info.strTrackThumb || '' },
            caption: msg
        }, { quoted: m });

    } catch (err) {
        console.log(err);
        reply("❌ Error fetching song info.");
    }
});
