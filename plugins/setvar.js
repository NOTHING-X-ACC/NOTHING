const { cmd } = require('../command');
const { setConfig, getConfig, getAllConfig } = require('../lib/configdb');
const config = require('../config');

cmd({
  pattern: "setvar",
  alias: ["setconfig", "var"],
  category: "owner",
  react: "⚙️",
  desc: "Set, get or list bot configuration variables instantly",
  filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply }) => {

  if (!isOwner) return reply("📛 Only the owner can use this command!");

  // No arguments
  if (!args[0]) {
    return reply(`🧩 *UMAR CONFIG PANEL*  

Use:
> .setvar list
> .setvar get PREFIX
> .setvar PREFIX !

Examples:
> .setvar MODE private
> .setvar BOT_NAME UMAR-BOT
`);
  }

  const action = args[0].toLowerCase();

  // List all configs🤭
  if (action === "list") {
    const all = getAllConfig();
    let text = "*⚙️ UMAR BOT SETTINGS ⚙️*\n\n";
    if (Object.keys(all).length === 0) text += "❌ No settings found in DB.\n";
    else {
      for (const [key, value] of Object.entries(all)) {
        text += `🧠 *${key}* = ${value}\n`;
      }
    }
    return reply(text);
  }

  // Get a specific config here......
  if (action === "get") {
    const key = args[1];
    if (!key) return reply("❌ Usage: `.setvar get <KEY>`\nExample: `.setvar get PREFIX`");
    const value = getConfig(key);
    if (!value) return reply(`⚠️ No value found for *${key}*`);
    return reply(`✅ *${key}* = ${value}`);
  }

  // ⚙️ Set config key=value
  const key = args[0].toUpperCase();
  const value = args.slice(1).join(" ");
  if (!key || !value)
    return reply("⚠️ Usage: `.setvar <KEY> <VALUE>`\nExample: `.setvar PREFIX !`");

  // Save to DB
  await setConfig(key, value);

  // popkids,db
  config[key] = value;

  reply(`✅ *${key}* has been set to: ${value}\n\n⚡ Applied instantly (no restart required)`);
});
