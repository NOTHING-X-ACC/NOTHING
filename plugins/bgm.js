const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");
const config = require("../config");

// Path to store BGM state
const STATE_PATH = path.join(__dirname, "../data/bgm.json");

// Load or create BGM state
let bgmState = { enabled: true, name: "" };
if (fs.existsSync(STATE_PATH)) {
  try {
    bgmState = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
  } catch (e) {
    console.error("❌ ERROR reading bgm.json:", e.message);
  }
} else {
  fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
}

// =======================================
// 🔊 BGM TOGGLE / SET COMMAND
// =======================================
cmd({
  pattern: "bgm",
  desc: "Set background music ON/OFF or manually set BGM name",
  category: "settings",
  react: "🎶",
  filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
  try {
    const sender = from.split("@")[0];
    const OWNER_NUMBER = config.OWNER_NUMBER || "923276650623";

    if (!OWNER_NUMBER.includes(sender))
      return reply("❌ Only owner can use this command!");

    if (!args[0]) {
      // Toggle
      bgmState.enabled = !bgmState.enabled;
      fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
      return reply(`✅ BGM is now *${bgmState.enabled ? "ON" : "OFF"}*`);
    }

    const cmdArg = args[0].toLowerCase();

    if (cmdArg === "on") {
      bgmState.enabled = true;
      fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
      return reply("✅ BGM turned ON");
    }

    if (cmdArg === "off") {
      bgmState.enabled = false;
      fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
      return reply("✅ BGM turned OFF");
    }

    if (cmdArg === "set" && args[1]) {
      bgmState.name = args.slice(1).join(" ");
      fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
      return reply(`✅ BGM name set to: *${bgmState.name}*`);
    }

    return reply("⚙️ Usage:\n.bgm on\n.bgm off\n.bgm set <name>");

  } catch (e) {
    console.error("❌ ERROR in BGM command:", e);
    reply("⚠️ Something went wrong!");
  }
});

// =======================================
// 🎵 BGM HANDLER — SAVE QUOTED VOICE
// =======================================
cmd({ on: "quoted" }, async (conn, mek, m) => {
  try {
    if (!bgmState.enabled) return;

    if (!m.quoted?.mtype?.includes("audioMessage")) return;

    const audioBuffer = await conn.downloadMediaMessage(m.quoted);

    if (!audioBuffer) return m.reply("❌ Could not fetch quoted audio.");

    const fileName = (bgmState.name || Date.now()) + ".mp3";
    const filePath = path.join(__dirname, "../tmp", fileName);

    fs.writeFileSync(filePath, audioBuffer);
    await m.reply(`✅ BGM saved as *${bgmState.name || fileName}*`);

  } catch (e) {
    console.error("❌ BGM handler error:", e);
    await m.reply("⚠️ Something went wrong while saving BGM");
  }
});
