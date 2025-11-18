const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const api = "https://facebook-downloader-chamod.vercel.app/api/fb";

// Facebook link detect
function extractFacebookLink(text) {
  if (!text) return null;
  const regex = /(https?:\/\/(?:www\.)?(?:facebook\.com|fb\.watch|fb\.com)\/[^\s]+)/i;
  const m = text.match(regex);
  return m ? m[0] : null;
}

// FB download handler
async function handleFbDownload(conn, from, mek, url) {
  try {
    if (!url) return;

    try { await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } }); } catch(e){}

    let waitMsg = await conn.sendMessage(from, { text: "*APKI FACEBOOK VIDEO DOWNLOAD HO RAHI HAI...*" }, { quoted: mek });

    const fb = await fetchJson(`${api}?url=${encodeURIComponent(url)}`);

    if (!fb?.download?.videos || fb.download.videos.length === 0) {
      if(waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key });
      return await conn.sendMessage(from, { text: "*Video nahi mila 😔*", quoted: mek });
    }

    // HD aur SD links
    let buttons = fb.download.videos.map((v, i) => ({
      buttonId: `fbdl_${i}`,
      buttonText: { displayText: v.quality },
      type: 1
    }));

    // Send buttons to choose quality
    await conn.sendMessage(from, { text: "*Kaunsi quality chahte ho?*", buttons: buttons, headerType: 1 }, { quoted: mek });

    // Handle user button click
    conn.on('message', async (reply) => {
      if (!reply.buttonId) return;
      const index = parseInt(reply.buttonId.split('_')[1]);
      const video = fb.download.videos[index];
      if (!video) return;
      await conn.sendMessage(from, {
        video: { url: video.link },
        mimetype: "video/mp4",
        caption: `*FB Video By: BILAL-MD*\nQuality: ${video.quality}`
      }, { quoted: mek });
    });

    try { if(waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key }); } catch(e){}
    try { await conn.sendMessage(from, { react: { text: "✅", key: mek.key } }); } catch(e){}

  } catch (err) {
    console.error("FB Download Error:", err);
    try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch(e){}
    await conn.sendMessage(from, { text: "*Kuch gadbad ho gai, video download nahi ho saka 😔*", quoted: mek });
  }
}

// Command
cmd({
  pattern: "fb",
  alias: ["fbvideo", "facebook"],
  desc: "Download FB video HD/SD",
  category: "download",
  react: "⏳",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("*FB video download karna hai? Link bhejo yahan:* `fb <link>`");
  await handleFbDownload(conn, from, mek, q);
});

// Auto detect FB links
cmd({
  on: "message",
  filename: __filename
}, async (conn, mek, m) => {
  const body = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text;
  if (!body) return;
  const firstChar = body.trim().charAt(0);
  if ([".", "!", "/", "#"].includes(firstChar)) return;

  const fbLink = extractFacebookLink(body);
  if (!fbLink) return;

  await handleFbDownload(conn, m.from, mek, fbLink);
});
