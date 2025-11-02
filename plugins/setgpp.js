const { cmd } = require('../command');
const { getBuffer } = require('../lib/functions');

cmd({
    pattern: "setgpp",
    alias: ["setgrouppic", "grouppp"],
    desc: "Change group profile picture (reply image / send image)",
    category: "group",
    react: "🎉",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmins, reply, quoted }) => {
    try {
        // Group check
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ This command can only be used in a group!");
        }

        // Bot admin check
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ Bot must be an admin to change group profile picture!");
        }

        let imageBuffer;

        // 1️⃣ Reply image check safely
        if (quoted && quoted.message && typeof quoted.message === 'object') {
            const type = Object.keys(quoted.message)[0];
            if (type === 'imageMessage') {
                imageBuffer = await getBuffer(quoted);
            }
        }

        // 2️⃣ Direct image check safely
        if (!imageBuffer && m.message && typeof m.message === 'object') {
            const type = Object.keys(m.message)[0];
            if (type === 'imageMessage') {
                imageBuffer = await getBuffer(m);
            }
        }

        // 3️⃣ No image found → error
        if (!imageBuffer) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ Please send or reply to an image to set as group profile picture.");
        }

        // 4️⃣ Update group profile picture
        await conn.groupUpdateProfilePicture(from, imageBuffer);
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        return reply("✅ Group profile picture updated successfully!");

    } catch (e) {
        console.error("Error in setgpp:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ Error: ${e.message}`);
    }
});
