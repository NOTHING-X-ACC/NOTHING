const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const api = `https://facebook-downloader-chamod.vercel.app/api/fb`;

// Facebook link detect
function extractFacebookLink(text) {
  if (!text) return null;
  const regex = /(https?:\/\/(?:www\.)?(?:facebook\.com|fb\.watch|fb\.com)\/[^\s]+)/i;
  const m = text.match(regex);
  return m ? m[0] : null;
}

// Core FB Download
async function handleFbDownload(conn, from, mek, url) {
  try {
    if (!url) return;

    try { await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } }); } catch(e){}

    let waitMsg = await conn.sendMessage(from, { text: "*APKI FACEBOOK VIDEO DOWNLOAD HO RAHI HAI...*" }, { quoted: mek });

    const fb = await fetchJson(`${api}?url=${encodeURIComponent(url)}`);

    // Check if API gives direct video link
    const videoUrl = fb.url || fb.hd_url || fb.sd_url;
    if (!videoUrl) {
      try { if(waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key }); } catch(e){}
      return await conn.sendMessage(from, { text: "*Video nahi mila 😔*", quoted: mek });
    }

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: "*👑 BY : BILAL-MD 👑*"
    }, { quoted: mek });

    try { await conn.sendMessage(from, { react: { text: "✅", key: mek.key } }); } catch(e){}
    try { if(waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key }); } catch(e){}

  } catch (err) {
    console.error("FB Download Error:", err);
    try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch(e){}
    await conn.sendMessage(from, { text: "*Kuch gadbad ho gai, video download nahi ho saka 😔*", quoted: mek });
  }
}

// FB Command
cmd({
  pattern: "fb",
  alias: ["fbvideo", "facebook"],
  desc: "Download Facebook video HD/SD",
  category: "download",
  react: "⏳",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("*FB video download karna hai? Link bhejo yahan:* `fb <link>`");
  await handleFbDownload(conn, from, mek, q);
});

// Auto scan for any FB link
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
