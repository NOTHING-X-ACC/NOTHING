const { cmd } = require('../command');
const config = require("../config");

if (!global.antiLinkStatus) global.antiLinkStatus = {};
if (!global.warnings) global.warnings = {};

cmd({
  pattern: "antilink",
  alias: ["alink"],
  react: "🥺",
  desc: "Enable or disable anti-link protection",
  category: "group",
  react: "🧩",
  filename: __filename
}, async (conn, m, store, {
  from,
  args,
  command,
  isGroup,
  isAdmins,
  reply
}) => {
  try {
    // 🔹 React jab command chale
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    if (!isGroup) {
      await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
      return reply("YEH COMMAND SIRF GROUPS ME USE KARE ☺️*");
    }

    if (!isAdmins) {
      await conn.sendMessage(from, { react: { text: "😇", key: m.key } });
      return reply("*YE COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI 😇 AP ADMIN NAHI HO 🙄*");
    }

    const action = args[0]?.toLowerCase();

    if (!action || (action !== 'on' && action !== 'off')) {
      await conn.sendMessage(from, { react: { text: "🌹", key: m.key } });
      return reply(`*👑 ANTI LINK COMMAND 👑*\n\n` +
                   `*ABHI ANTILINK ${global.antiLinkStatus[from] ? 'ON' : 'OFF'} HAI 😇*\n\n` +
                   `*GROUP ME KOI BHI MEMBER AGAR LINK BHEJE GA 🙂 TO USE 3 WARNINGS DE JAYE GE 😇 JAB 3 WORKINGS KHATAM HOGI 😐 WO MEMBER REMOVE HO JAYE GAA 😊*\n *AGAR AP NE ❮ANTI-LINK❯ ON YA OFF KARNA HAI ☺️ TO NICHE METHOD HAI 🥰🌹*\n` +
                   `*• 👑 ANTILINK ON - ❮FOR ACTIVATE❯*\n` +
                   `*• 👑 ANTILINK OFF - ❮FOR CLOSE❯*`);
    }

    if (action === 'on') {
      global.antiLinkStatus[from] = true;
      await conn.sendMessage(from, { react: { text: "🥳", key: m.key } });
      await reply(`*👑 ANTILINK NOW ON👑*\n\n *SUNO ALL MEMBERS 🤨*\n\n*ANTI-LINK AB IS GROUP ME ON KAR DIA GAYA HAI 😃 AB JO KOI BHI IS GROUP ME LINK BHEJE GA 😐 USKO ❮3❯ WARNINGS MILE GE 😒 JESE HI WO ❮3❯ WARNINGS KHATAM HOGI 🙂 WO MEMBER REMOVE HOGA 🙄* \n *SO TAKE CARE ☺️ AB LINK NAA AYE IS GROUP ME 😇*`);
    } else {
      global.antiLinkStatus[from] = false;
      await conn.sendMessage(from, { react: { text: "☹️", key: m.key } });
      await reply(`*👑 ANTI-LINK NOW OFF 👑* \n\n *SUNO SAB MEMBERS ☺️*\n\n*ANTI-LINK IS GROUP ME OFF KAR DIYA GAYA HAI 😌 AB AP SAB IS GROUP ME LINKS SHARE KAR SAKTE HAI ENJOY 🥳*`);
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    reply("DUBARA KOSHSIHS KARE 😔*");
  }
});

cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins || !global.antiLinkStatus[from]) return;

    const linkPatterns = [
      /https?:\/\/chat\.whatsapp\.com\/\S+/gi,
      /https?:\/\/api\.whatsapp\.com\/\S+/gi,
      /(?:https?:\/\/)?wa\.me\/\S+/gi,
      /(?:https?:\/\/)?t\.me\/\S+/gi,
      /(?:https?:\/\/)?telegram\.me\/\S+/gi,
      /https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?x\.com\/\S+/gi,
      /https?:\/\/channel\.whatsapp\.com\/\S+/gi
    ];

    if (!body || typeof body !== 'string') return;
    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (!containsLink) return;

    // 🪄 React jab link detect ho
    await conn.sendMessage(from, { react: { text: "🤨", key: m.key } });
    console.log(`*AP  ${sender}: ${body.substring(0, 50)} NE LINK Q BHEJA 🤨*`);

    try {
      await conn.sendMessage(from, { delete: m.key });
      await conn.sendMessage(from, { react: { text: "🥳", key: m.key } });
      console.log(`LINK DELETED ✅ ${m.key.id}`);
    } catch (deleteError) {
      console.error("❌ Failed to delete message:", deleteError.message);
      await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }

    global.warnings[sender] = (global.warnings[sender] || 0) + 1;
    const warningCount = global.warnings[sender];
    console.log(`*APKI ${sender} ITNE WARNING ❮${warningCount}❯ HAI 🙂* `);

    if (warningCount < 4) {
      await conn.sendMessage(from, { react: { text: "😎", key: m.key } });
      await conn.sendMessage(from, {
        text: `*LINK NAHI BHEJNA 🤨*\n\n` +
              `*╭────👑 WARNING 👑────*\n` +
              `*├👑 USER:❯* @${sender.split('@')[0]}\n` +
              `*├👑 WARNING:❯ ${warningCount}/3*\n` +
              `*├👑 REASON:❯ LINK FOUNDED*\n` +
              `*├👑 ACTION:❯ LINK DELETED*\n` +
              `*╰────────────────*\n\n` +
              `*APKI WARNING JESE KHATAM HOGI 😌 APKO REMOVE KAR DIA JAYE GA 😒*`,
        mentions: [sender]
      });
    } else {
      await conn.sendMessage(from, { react: { text: "😡", key: m.key } });
      await conn.sendMessage(from, {
        text: `*👑 MEMBER REMOVED 👑*\n\n` +
              `*MENE INKO @${sender.split('@')[0]} REMOVE KAR DIA 😒 Q K INKI WARNINGS (${warningCount}/3) KHATAM HO GAYI THY ☺️*\n\n` +
              `*👑 BILAL-MD WHATSAPP BOT 👑*`,
        mentions: [sender]
      });

      try {
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        await conn.sendMessage(from, { react: { text: "😶", key: m.key } });
        console.log(`*YEH ${sender} MEMBER REMOVE HO GAYA 😶*`);
        delete global.warnings[sender];
      } catch (removeError) {
        console.error("❌ Failed to remove user:", removeError.message);
        await conn.sendMessage(from, { react: { text: "😓", key: m.key } });
        reply("❌ Failed to remove user. Check bot permissions.");
      }
    }
  } catch (error) {
    console.error("❌ Anti-link error:", error);
    await conn.sendMessage(from, { react: { text: "⚠️", key: m.key } });
  }
});
