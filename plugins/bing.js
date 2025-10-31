// aiBot.js
const axios = require('axios');
const fetch = require('node-fetch');
const { cmd } = require('./command'); // adjust path if needed

cmd({
  pattern: 'bing',
  alias: ['gemini', 'ai1', 'a1', 'a2', 'ai2'],
  desc: 'Ask AI a question 🤔',
  category: 'ai',
  react: '🤖',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    // React to command
    await conn.sendMessage(from, { reactionMessage: { key: m.key, text: '🤖' } });

    if (!q) return reply('*🥺 Please write your question after the command!*\n\nExample:\n.ai What is AI?');

    // Send waiting message
    let waitMsg = await reply('⏳ *AI se jawab aa raha hai, thodi der intezar karein...*');

    let aiResponse = null;

    // Main API
    try {
      const res = await axios.get(`https://api.dreamed.site/api/chatgpt?text=${encodeURIComponent(q)}`);
      if (res.data?.answer) aiResponse = res.data.answer;
    } catch (err) {
      console.error('Main AI API error:', err.message);
    }

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

    // Delete waiting message
    await conn.sendMessage(waitMsg.key.remoteJid, { delete: waitMsg.key });

    if (aiResponse) {
      // Send AI response in Bilal/ Shaban MD style
      const caption = `*👑 BILAL-MD / SHABAN-MD AI BOT 🤖*\n\n${aiResponse}\n\n*🥰 Powered by AI*`;
      await conn.sendMessage(from, { text: caption }, { quoted: mek });
      // React happy to original command
      await conn.sendMessage(from, { reactionMessage: { key: m.key, text: '☺️' } });
    } else {
      await reply('😔 Sorry, I could not get an AI response.');
      await conn.sendMessage(from, { reactionMessage: { key: m.key, text: '❌' } });
    }

  } catch (err) {
    console.error('AI command error:', err);
    await reply('😔 Something went wrong while processing your request.');
  }
});
