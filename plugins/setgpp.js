const { cmd } = require('../command');
const { getBuffer } = require('../lib/functions');

cmd({
    pattern: "setgpp",
    alias: ["setgrouppic", "grouppp"],
    desc: "Change group profile picture (reply image / send image with caption)",
    category: "group",
    react: "😭",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmins, reply, quoted }) => {
    try {
        // ✅ Group check
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }

        // ✅ Bot admin check
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: "😎", key: m.key } });
            return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
        }

        let imageBuffer;

        // 1️⃣ Reply image check
        if (quoted?.message?.imageMessage) {
            imageBuffer = await getBuffer(quoted);
        }

        // 2️⃣ Direct image with caption
        else if (m.message?.imageMessage) {
            imageBuffer = await getBuffer(m);
        }

        // 3️⃣ If no image found → react & reply
        if (!imageBuffer) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("*❌ Please send or reply to an image to set as group profile picture!*");
        }

        // 4️⃣ Update group profile picture
        await conn.groupUpdateProfilePicture(from, imageBuffer);

        // ✅ Success react & reply
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
        return reply("*✅ Group profile picture updated successfully! 🥰*");

    } catch (e) {
        console.error("Error in setgpp:", e);
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply("*❌ Koi masla aa gaya! Dubara try karo 🥺*");
    }
});
