const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

cmd({
    pattern: "setpp",
    alias: ["setbotpp", "setprofile", "ppbot"],
    react: "🤳",
    desc: "Change the bot's profile picture (Owner only)",
    category: "owner",
    use: ".setpp (reply to image)",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator) return reply("❌ *Only the bot owner can use this command!*");

        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || "";

        if (!mime || !mime.startsWith("image/")) {
            return reply("📸 *Reply to an image* or send one with `.setpp` caption.");
        }

        // Create tmp directory if not exists
        const tmpDir = path.join(process.cwd(), "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        // Download image data
        const stream = await downloadContentFromMessage(quoted.msg, "image");
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Save image
        const imagePath = path.join(tmpDir, `botpp_${Date.now()}.jpg`);
        fs.writeFileSync(imagePath, buffer);

        // Update bot profile picture
        await conn.updateProfilePicture(conn.user.id, { url: imagePath });

        // Clean up
        fs.unlinkSync(imagePath);

        reply("✅ *Bot profile picture updated successfully!*");

    } catch (err) {
        console.error("❌ Error in setpp command:", err);
        reply("❌ Failed to change bot profile picture. Make sure you reply to a valid image.");
    }
});
