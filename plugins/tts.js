const { cmd } = require("../command");
const googleTTS = require("google-tts-api");
const axios = require("axios");

cmd({
  pattern: "tts",
  desc: "Convert text to speech (fixed audio)",
  category: "fun",
  react: "🔊",
  filename: __filename
},
async (conn, mek, m, { from, q, args, reply }) => {
  try {
    if (!q) return reply("❌ Please provide text!\nExample: `.tts hello world`");

    // language select
    let voiceLanguage = "en-US";
    if (args[0] === "ur" || args[0] === "urdu") voiceLanguage = "ur";

    // get google tts url
    const ttsUrl = googleTTS.getAudioUrl(q, {
      lang: voiceLanguage,
      slow: false,
      host: "https://translate.google.com"
    });

    // download audio properly
    const { data } = await axios.get(ttsUrl, { responseType: "arraybuffer" });
    const audioBuffer = Buffer.from(data, "binary");

    // send as normal audio (NOT ptt)
    await conn.sendMessage(from, {
      audio: audioBuffer,
      mimetype: "audio/mp4", // ✅ use mp4 to fix WhatsApp playback
      fileName: "tts.mp3",
      ptt: false
    }, { quoted: mek });

  } catch (err) {
    console.error("TTS Error:", err);
    reply("❌ Error creating voice: " + err.message);
  }
});
