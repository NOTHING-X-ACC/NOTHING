const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

cmd({
    pattern: "setpp",
    alias: ["setbotpp", "setprofile", "ppbot"],
    react: "😇",
    desc: "Change the bot's profile picture (Owner only)",
    category: "owner",
    use: ".setpp (reply to an image)",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        // 🧩 Owner Check
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "😎", key: mek.key } });
            return reply("*YEH COMMAND SIRF MERE LIE HAI 😎*");
        }

        // 🖼️ Check if replied to an image
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || "";
        if (!mime || !mime.startsWith("image/")) {
            await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
            return reply(
                "*KISI BHI PHOTO KO MENTION KARO 🥺❤️*\n\n" +
                "*Phir likho:*  `.setpp`\n\n" +
                "*Jab tum ese likhoge to bot ki profile picture change ho jayegi 🥰🌹*"
            );
        }

        // 📂 Create tmp directory if not exists
        const tmpDir = path.join(process.cwd(), "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        // 💾 Download image
        await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });
        const stream = await downloadContentFromMessage(quoted.msg, "image");
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        // 🖼️ Save to temporary file
        const imagePath = path.join(tmpDir, `botpp_${Date.now()}.jpg`);
        fs.writeFileSync(imagePath, buffer);

        // ✨ Update bot profile picture
        await conn.sendMessage(from, { react: { text: "🪄", key: mek.key } });
        await conn.updateProfilePicture(conn.user.id, { file: fs.readFileSync(imagePath) });

        // 🧹 Delete temporary image
        fs.unlinkSync(imagePath);

        // ✅ Success
        await conn.sendMessage(from, { react: { text: "😍", key: mek.key } });
        reply("*BOT KI PROFILE PHOTO CHANGE HO GAYI HAI 😊❤️*");

    } catch (err) {
        console.error("❌ Error setting profile photo:", err);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*ERROR AYA 😔 DUBARA TRY KARO AUR PHOTO KO REPLY KARO ❤️*");
    }
});
