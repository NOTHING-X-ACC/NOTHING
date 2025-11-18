const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const api = "https://facebook-downloader-chamod.vercel.app/api/fb";

cmd({
  pattern: "fb",
  alias: ["fbvideo"],
  desc: "Simple FB video download HD/SD",
  category: "download",
  react: "⏳",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("*Link bhejo FB video ka:*\nExample: `fb <link>`");

  try {
    await reply("*Video check kar rahe hai...* ⏳");
    const fb = await fetchJson(`${api}?url=${encodeURIComponent(q)}`);

    if (!fb?.download?.videos || fb.download.videos.length === 0) {
      return reply("*Video nahi mila 😔*");
    }

    // List HD/SD with number
    let text = "*Choose quality by typing number:*\n";
    fb.download.videos.forEach((v, i) => {
      text += `\n${i+1}. ${v.quality}`;
    });

    await reply(text);

    // Listen for next message from same user for number
    conn.on('message', async (res) => {
      if (res.key.remoteJid !== from) return;
      const choice = parseInt(res.text);
      if (!choice || choice < 1 || choice > fb.download.videos.length) return;
      const video = fb.download.videos[choice-1];

      await conn.sendMessage(from, {
        video: { url: video.link },
        mimetype: "video/mp4",
        caption: `*FB Video*\nQuality: ${video.quality}`
      }, { quoted: mek });
    });

  } catch (err) {
    console.error(err);
    await reply("*Kuch gadbad ho gai, video download nahi ho saka 😔*");
  }
});
