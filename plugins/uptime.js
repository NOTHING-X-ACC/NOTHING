// Updated by BILAL-MD
const { cmd } = require('../command');
const { runtime, sleep } = require('../lib/functions');

cmd({
  pattern: "uptime",
  alias: ["runtime", "up"],
  desc: "Show bot uptime with live updates",
  category: "main",
  react: "⏱️",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Step 1: Send initial message
    const checkingMsg = await conn.sendMessage(from, { 
      text: "*CHECKING UPTIME.....☺️*" 
    }, { quoted: mek });

    // Step 2: Wait 3 seconds before showing uptime
    await sleep(3000);

    // Step 3: Edit message to show first uptime
    const up = runtime(process.uptime());
    await conn.relayMessage(from, {
      protocolMessage: {
        key: checkingMsg.key,
        type: 14,
        editedMessage: {
          conversation: `*👑 UPTIME :❯ ${up} 👑*`
        }
      }
    }, {});

    // Step 4: Update uptime every second for 60 seconds
    for (let i = 0; i < 60; i++) {
      await sleep(1000);
      const newUp = runtime(process.uptime());
      await conn.relayMessage(from, {
        protocolMessage: {
          key: checkingMsg.key,
          type: 14,
          editedMessage: {
            conversation: `*👑 UPTIME :❯ ${newUp} 👑*`
          }
        }
      }, {});
    }

  } catch (e) {
    console.error("Uptime Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});
