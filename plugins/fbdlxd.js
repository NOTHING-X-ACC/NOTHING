const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const api = "https://facebook-downloader-chamod.vercel.app/api/fb";

// Temp user selection map
const userPending = {};

cmd({
  pattern: "fbdlxd",
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

    // Save user state
    userPending[from] = fb.download.videos;

    // List HD/SD with number
    let text = "*Choose quality by typing number:*\n";
    fb.download.videos.forEach((v, i) => {
      text += `\n${i+1}. ${v.quality}`;
    });

    await reply(text);

  } catch (err) {
    console.error(err);
    await reply("*Kuch gadbad ho gai, video download nahi ho saka 😔*");
  }
});

// Number select handler
cmd({
  on: "message",
  filename: __filename
}, async (conn, mek, m) => {
  const from = m.key.remoteJid;
  if (!userPending[from]) return;

  const choice = parseInt(m.text);
  const videos = userPending[from];
  if (!choice || choice < 1 || choice > videos.length) return;

  const video = videos[choice - 1];

  try {
    await conn.sendMessage(from, {
      video: { url: video.link },
      mimetype: "video/mp4",
      caption: `*FB Video*\nQuality: ${video.quality}`
    }, { quoted: mek });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: "*Video send nahi ho saka 😔*", quoted: mek });
  }

  // Clear user state
  delete userPending[from];
});
