// 🔥 Code by BILAL (Improved UPTIME Format)
const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
  pattern: "uptime",
  alias: ["runtime", "utime", "upt", "upti", "uptim", "uptimes"],
  desc: "Show bot uptime with live updates every 1 second for 30 minutes",
  category: "main",
  react: "🌹",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // 🥺 React when command starts
    await conn.sendMessage(from, { react: { text: '🌹', key: m.key } });

    // ⏱️ Initial waiting message
    const msg = await conn.sendMessage(from, {
      text: `*CHECKING UPTIME.....☺️*`
    }, { quoted: mek });

    // Wait 3 seconds before showing uptime
    await sleep(3000);

    // Function to format uptime like 00H 00M 00S
    function formatUptime(seconds) {
      const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const secs = String(Math.floor(seconds % 60)).padStart(2, '0');
      return `${hrs} ${mins} ${secs}`;
    }

    // 🔁 Update every second for 30 minutes (1800s)
    for (let i = 0; i < 1800; i++) {
      const uptime = formatUptime(process.uptime());
      await sleep(1000);
      await conn.relayMessage(from, {
        protocolMessage: {
          key: msg.key,
          type: 14,
          editedMessage: {
            conversation: `*👑 UPTIME :❯ ${uptime} 👑*`
          }
        }
      }, {});
    }

    // ☺️ React when updates end
    await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });

  } catch (e) {
    console.error("Uptime Error:", e);
    await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
    reply(`*DUBARA ❮uptime❯ LIKHO 🥺*`);
  }
});
