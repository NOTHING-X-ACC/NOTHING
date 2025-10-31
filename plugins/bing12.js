// aiBot.js
const axios = require('axios');
const fetch = require('node-fetch');
const { cmd } = require('./command');

cmd({
  pattern: 'bing12',
  alias: ['gemini', 'ai1', 'a1', 'a2', 'ai2'],
  desc: 'Ask AI a question 🤔',
  category: 'ai',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('*🥺 Please write your question after the command!*\n\nExample:\n.bing What is AI?');

    let aiResponse = null;

    // Main API
    try {
      const res = await axios.get(`https://api.dreamed.site/api/chatgpt?text=${encodeURIComponent(q)}`);
      if (res.data?.answer) aiResponse = res.data.answer;
    } catch (_) {}

    // Fallback APIs
    if (!aiResponse) {
      const fallbackUrls = [
        `https://api.giftedtech.my.id/api/ai?text=${encodeURIComponent(q)}`,
        `https://api.giftedtech.my.id/api/ai1?text=${encodeURIComponent(q)}`,
        `https://api.someotherapi.com/ai?query=${encodeURIComponent(q)}`
      ];

      for (const url of fallbackUrls) {
        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data?.answer) {
            aiResponse = data.answer;
            break;
          }
        } catch (_) { continue; }
      }
    }

    if (aiResponse) {
      await conn.sendMessage(from, { text: aiResponse }, { quoted: mek });
    } else {
      await reply('😔 Sorry, I could not get an AI response.');
    }

  } catch (err) {
    console.error('AI command error:', err);
    await reply('😔 Something went wrong while processing your request.');
  }
});
