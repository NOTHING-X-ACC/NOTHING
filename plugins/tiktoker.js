const axios = require('axios');
const { sms } = require('../lib/msg'); // aapke sms.js ka path

module.exports = {
  name: "tiktoker",
  alias: ["tt", "ttdl", "tiktokdl"],
  desc: "Download TikTok video using custom API",
  category: "downloader",
  async exec(conn, mek, args) {
    const m = sms(conn, mek);
    if (!args[0]) return m.reply("❌ Please provide a TikTok video URL!");

    const tiktokUrl = args[0];
    try {
      // API call to your custom TikTok API
      const apiRes = await axios.post("https://tiktokapikey-795e60b7ebb1.herokuapp.com/api/tiktok", {
        url: tiktokUrl
      });

      const videoUrl = apiRes.data.videoUrl;
      if (!videoUrl) return m.reply("❌ Failed to get video URL!");

      // Download video as buffer
      const videoRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
      const videoBuffer = Buffer.from(videoRes.data, "binary");

      // Send video on WhatsApp
      await m.reply(videoBuffer, "video"); // sms.js reply adapted for video

    } catch (err) {
      console.error(err);
      m.reply("❌ Failed to download TikTok video. Try again!");
    }
  }
};
