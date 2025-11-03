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
    use: ".setpp (reply to image)",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        // 🧩 Owner check
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "😎", key: mek.key } });
            return reply("*YEH COMMAND SIRF MERE LIE HAI 😎*");
        }

        // 🖼️ Image check
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || "";

        if (!mime || !mime.startsWith("image/")) {
            await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
            return reply("*KISI BHI PHOTO KO MENTION KARO 🥺* \n *AUR PHIR ESE LIKHO ☺️* \n\n *❮SETPP❯* \n\n *JAB AP ESE LIKHO GE ☺️ TO APKI WHATSAPP KI PROFILE PHOTO PER WAHI PHOTO LAG JAYE GE 🥰🌹*");
        }

        // 📂 Temporary folder check/create
        const tmpDir = path.join(process.cwd(), "tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        // 💾 Downloading image
        await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });
        const stream = await downloadContentFromMessage(quoted.msg, "image");
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // 🖼️ Save temp image file
        const imagePath = path.join(tmpDir, `botpp_${Date.now()}.jpg`);
        fs.writeFileSync(imagePath, buffer);

        // 🧠 Update bot profile picture
        await conn.sendMessage(from, { react: { text: "🪄", key: mek.key } });
        await conn.updateProfilePicture(conn.user.id, { url: imagePath });

        // 🧹 Clean up temp file
        fs.unlinkSync(imagePath);

        // ✅ Success message
        await conn.sendMessage(from, { react: { text: "😍", key: mek.key } });
        reply("*PROFILE PHOTO CHANGE HO CHUKI HAI 😊❤️*");

    } catch (err) {
        console.error("*DUBARA KOSHISH KARE 🥺❤️*", err);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*SIRF PHOTO KO MENTION KARO 🥺❤️*");
    }
});
