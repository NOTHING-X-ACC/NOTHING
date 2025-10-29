const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require("../data/updateDB");

// =========================================
// 🔄 AUTO UPDATE COMMAND FOR BILAL-MD BOT
// =========================================
cmd({
  pattern: "update",
  alias: ["upgrade", "sync", "up", "upd", "upda", "updates"],
  react: "🆕",
  desc: "Update the bot to the latest version.",
  category: "misc",
  filename: __filename,
}, async (client, m, store, { reply, isOwner }) => {
  try {
    if (!isOwner) return reply("*YEH COMMAND SIRF MERE LIE HAI 😎*");

    await reply("*BILAL-MD BOT ME NEW FEATURES CHECK HO RAHI HAI....🥺❤️*");

    // Fetch the latest commit hash from your GitHub repo
    const { data: commitData } = await axios.get(
      "https://api.github.com/repos/NOTHING-X-ACC/NOTHING/commits/main"
    );
    const latestCommit = commitData.sha;
    const currentCommit = await getCommitHash();

    if (latestCommit === currentCommit) {
      return reply("*BOT ME PEHLE SE NEW FEATURES ADD HAI ☺️🌹*");
    }

    await reply("*BILAL-MD BOT ME NEW FEATURES ADD HO RAHE HAI ☺️ THORA SA INTAZAR KARE...🌹*");

    // Download latest ZIP from GitHub
    const zipUrl = "https://github.com/NOTHING-X-ACC/NOTHING/archive/refs/heads/main.zip";
    const zipPath = path.join(__dirname, "update.zip");
    const { data: zipData } = await axios.get(zipUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, zipData);

    await reply("*BOT ME NEW FEATURES ADD HO CHUKE HAI 😍🌹*");
    const extractPath = path.join(__dirname, "update-temp");
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // ⚙️ Correct folder name inside ZIP (GitHub appends "-main")
    const sourcePath = path.join(extractPath, "NOTHING-main");
    const destinationPath = path.join(__dirname, "..");

    // Copy files safely
    await reply("*ADDING NEW THINGS....*");
    copyFolderSync(sourcePath, destinationPath);

    // Save new commit hash
    await setCommitHash(latestCommit);

    // Cleanup
    fs.unlinkSync(zipPath);
    fs.rmSync(extractPath, { recursive: true, force: true });

    await reply("✅ Update complete! Restarting the bot...");
    process.exit(0);
  } catch (error) {
    console.error("❌ Update error:", error);
    reply("⚠️ Update failed. Please try again or update manually.");
  }
});

// =============================
// 📂 Copy Folder Helper
// =============================
function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source);
  for (const item of items) {
    // Skip personal files
    if (["config.js", "app.json", ".env"].includes(item)) {
      console.log(`⏩ Skipping ${item} to preserve settings.`);
      continue;
    }

    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
