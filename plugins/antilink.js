const { cmd } = require('../command');
const config = require("../config");

// Initialize AntiLink data
if (!global.antiLinkGroups) global.antiLinkGroups = {};
if (!global.warnings) global.warnings = {};

// ─── COMMAND: antilink on/off ───
cmd({
  pattern: "antilink",
  alias: ["antilinks"],
  desc: "Turn Anti-Link feature on or off per group",
  category: "group",
  filename: __filename
}, async (conn, m, match, { from, isGroup, isAdmins, reply }) => {
  if (!isGroup) return reply("❌ This command can only be used in groups.");
  if (!isAdmins) return reply("🛑 Only group admins can use this command.");

  const arg = match?.trim()?.toLowerCase();
  if (!arg || !["on", "off"].includes(arg)) {
    return reply(
      `*⚙️ Anti-Link Settings*\n\n` +
      `Use:\n` +
      `> *.antilink on* – Enable Anti-Link\n` +
      `> *.antilink off* – Disable Anti-Link\n\n` +
      `📍 Current status: *${global.antiLinkGroups[from] ? "ON" : "OFF"}*`
    );
  }

  if (arg === "on") {
    global.antiLinkGroups[from] = true;
    return reply("✅ *Anti-Link has been enabled for this group.*");
  } else {
    delete global.antiLinkGroups[from];
    return reply("❎ *Anti-Link has been disabled for this group.*");
  }
});

// ─── AUTOMATIC Anti-Link Detection ───
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
    if (!isGroup) return;
    if (!isBotAdmins) return;
    if (isAdmins) return;

    // Check if Anti-Link is active in this group
    if (!global.antiLinkGroups[from]) return;

    // Check message validity
    if (!body || typeof body !== 'string') return;

    // Detect links
    const linkPatterns = [
      /https?:\/\/chat\.whatsapp\.com\/\S+/i,
      /https?:\/\/api\.whatsapp\.com\/\S+/i,
      /(?:https?:\/\/)?wa\.me\/\S+/i,
      /(?:https?:\/\/)?t\.me\/\S+/i,
      /(?:https?:\/\/)?telegram\.me\/\S+/i,
      /https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.(com|net|org|io|me|xyz)\/\S*/i,
      /https?:\/\/(?:www\.)?(twitter|x)\.com\/\S+/i,
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/i,
      /https?:\/\/channel\.whatsapp\.com\/\S+/i,
      /https?:\/\/(?:www\.)?reddit\.com\/\S+/i,
      /https?:\/\/(?:www\.)?discord(?:app)?\.com\/\S+/i,
      /https?:\/\/(?:www\.)?twitch\.tv\/\S+/i,
      /https?:\/\/(?:www\.)?vimeo\.com\/\S+/i,
      /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/i,
      /https?:\/\/(?:www\.)?medium\.com\/\S+/i
    ];

    const containsLink = linkPatterns.some(pattern => pattern.test(body));
    if (!containsLink) return;

    console.log(`🔗 Link detected from ${sender}: ${body.substring(0, 50)}...`);

    // Delete the message
    try {
      if (m.key && m.key.remoteJid) {
        await conn.sendMessage(from, { delete: m.key });
      }
    } catch (err) {
      console.error("❌ Failed to delete message:", err.message);
    }

    // Warnings system
    if (!global.warnings[from]) global.warnings[from] = {};
    global.warnings[from][sender] = (global.warnings[from][sender] || 0) + 1;

    const count = global.warnings[from][sender];

    if (count < 3) {
      await conn.sendMessage(from, {
        text: `*⚠️ LINK DETECTED!*\n\n` +
              `*╭──────⬡ WARNING ⬡──────*\n` +
              `*├▢ USER:* @${sender.split('@')[0]}\n` +
              `*├▢ WARNING:* ${count}/3\n` +
              `*├▢ ACTION:* Message Deleted\n` +
              `*╰────────────────────*\n\n` +
              `_Next violation will result in removal!_`,
        mentions: [sender]
      });
    } else {
      await conn.sendMessage(from, {
        text: `*🚫 REMOVAL NOTICE 🚫*\n\n` +
              `@${sender.split('@')[0]} has been removed for exceeding the 3-warning limit.\n\n` +
              `_Reason: Multiple link violations_`,
        mentions: [sender]
      });

      try {
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        delete global.warnings[from][sender];
      } catch (e) {
        console.error("❌ Failed to remove user:", e.message);
        await reply("⚠️ Unable to remove user — check bot permissions.");
      }
    }
  } catch (error) {
    console.error("❌ Anti-Link Error:", error);
  }
});const { cmd } = require('../command');
const config = require("../config");

// Initialize AntiLink data
if (!global.antiLinkGroups) global.antiLinkGroups = {};
if (!global.warnings) global.warnings = {};

// ─── COMMAND: antilink on/off ───
cmd({
  pattern: "antilink",
  alias: ["antilinks"],
  desc: "Turn Anti-Link feature on or off per group",
  category: "group",
  filename: __filename
}, async (conn, m, match, { from, isGroup, isAdmins, reply }) => {
  if (!isGroup) return reply("❌ This command can only be used in groups.");
  if (!isAdmins) return reply("🛑 Only group admins can use this command.");

  const arg = match?.trim()?.toLowerCase();
  if (!arg || !["on", "off"].includes(arg)) {
    return reply(
      `*⚙️ Anti-Link Settings*\n\n` +
      `Use:\n` +
      `> *.antilink on* – Enable Anti-Link\n` +
      `> *.antilink off* – Disable Anti-Link\n\n` +
      `📍 Current status: *${global.antiLinkGroups[from] ? "ON" : "OFF"}*`
    );
  }

  if (arg === "on") {
    global.antiLinkGroups[from] = true;
    return reply("✅ *Anti-Link has been enabled for this group.*");
  } else {
    delete global.antiLinkGroups[from];
    return reply("❎ *Anti-Link has been disabled for this group.*");
  }
});

// ─── AUTOMATIC Anti-Link Detection ───
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
    if (!isGroup) return;
    if (!isBotAdmins) return;
    if (isAdmins) return;

    // Check if Anti-Link is active in this group
    if (!global.antiLinkGroups[from]) return;

    // Check message validity
    if (!body || typeof body !== 'string') return;

    // Detect links
    const linkPatterns = [
      /https?:\/\/chat\.whatsapp\.com\/\S+/i,
      /https?:\/\/api\.whatsapp\.com\/\S+/i,
      /(?:https?:\/\/)?wa\.me\/\S+/i,
      /(?:https?:\/\/)?t\.me\/\S+/i,
      /(?:https?:\/\/)?telegram\.me\/\S+/i,
      /https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.(com|net|org|io|me|xyz)\/\S*/i,
      /https?:\/\/(?:www\.)?(twitter|x)\.com\/\S+/i,
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/i,
      /https?:\/\/channel\.whatsapp\.com\/\S+/i,
      /https?:\/\/(?:www\.)?reddit\.com\/\S+/i,
      /https?:\/\/(?:www\.)?discord(?:app)?\.com\/\S+/i,
      /https?:\/\/(?:www\.)?twitch\.tv\/\S+/i,
      /https?:\/\/(?:www\.)?vimeo\.com\/\S+/i,
      /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/i,
      /https?:\/\/(?:www\.)?medium\.com\/\S+/i
    ];

    const containsLink = linkPatterns.some(pattern => pattern.test(body));
    if (!containsLink) return;

    console.log(`🔗 Link detected from ${sender}: ${body.substring(0, 50)}...`);

    // Delete the message
    try {
      if (m.key && m.key.remoteJid) {
        await conn.sendMessage(from, { delete: m.key });
      }
    } catch (err) {
      console.error("❌ Failed to delete message:", err.message);
    }

    // Warnings system
    if (!global.warnings[from]) global.warnings[from] = {};
    global.warnings[from][sender] = (global.warnings[from][sender] || 0) + 1;

    const count = global.warnings[from][sender];

    if (count < 3) {
      await conn.sendMessage(from, {
        text: `*⚠️ LINK DETECTED!*\n\n` +
              `*╭──────⬡ WARNING ⬡──────*\n` +
              `*├▢ USER:* @${sender.split('@')[0]}\n` +
              `*├▢ WARNING:* ${count}/3\n` +
              `*├▢ ACTION:* Message Deleted\n` +
              `*╰────────────────────*\n\n` +
              `_Next violation will result in removal!_`,
        mentions: [sender]
      });
    } else {
      await conn.sendMessage(from, {
        text: `*🚫 REMOVAL NOTICE 🚫*\n\n` +
              `@${sender.split('@')[0]} has been removed for exceeding the 3-warning limit.\n\n` +
              `_Reason: Multiple link violations_`,
        mentions: [sender]
      });

      try {
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        delete global.warnings[from][sender];
      } catch (e) {
        console.error("❌ Failed to remove user:", e.message);
        await reply("⚠️ Unable to remove user — check bot permissions.");
      }
    }
  } catch (error) {
    console.error("❌ Anti-Link Error:", error);
  }
});
