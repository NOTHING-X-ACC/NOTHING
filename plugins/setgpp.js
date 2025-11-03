const { cmd } = require('../command');
const fs = require('fs');
const axios = require('axios');
const { isUrl } = require('../lib/functions');

cmd({
    pattern: "grouppic",
    alias: ["setgpp", "setgrouppic", "groupdp"],
    react: "🖼️",
    desc: "Change the group profile picture",
    category: "group",
    use: ".grouppic (reply to image or send image)",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isAdmins) return reply("⛔ Only *group admins* can use this command.");
        if (!isBotAdmins) return reply("❌ I need *admin privileges* to change the group picture.");

        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || "";
        let mediaPath;

        // Case 1: If user sent or replied to an image
        if (mime && mime.startsWith("image/")) {
            mediaPath = await conn.downloadAndSaveMediaMessage(quoted, "group-pic-");
        } 
        // Case 2: If user provides an image URL
        else if (args[0] && isUrl(args[0])) {
            const url = args[0];
            const response = await axios.get(url, { responseType: "arraybuffer" });
            mediaPath = "./group-pic-" + Date.now() + ".jpg";
            fs.writeFileSync(mediaPath, response.data);
        } 
        else {
            return reply("📸 Reply to an image or provide an image URL to set as the group profile picture.");
        }

        // Update group profile picture
        await conn.updateProfilePicture(from, { url: mediaPath });
        reply("✅ Group profile picture updated successfully!");

        // Clean up the temporary image
        fs.unlinkSync(mediaPath);

    } catch (err) {
        console.error("❌ Error in grouppic command:", err);
        reply("❌ Failed to change group picture. Make sure the bot is admin and image is valid.");
    }
});
