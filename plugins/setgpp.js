const { cmd } = require('../command');
const { getBuffer } = require('../lib/functions');

cmd({
    pattern: "setgpp",
    alias: ["setgrouppic", "grouppp"],
    desc: "Change group profile picture (bot must be admin)",
    category: "group",
    react: "😫",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmins, reply, quoted }) => {
    try {
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ This command can only be used in a group!");
        }

        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ Bot must be an admin to change group profile picture!");
        }

        let imageBuffer;

        // 1️⃣ Check if user replied to an image
        if (quoted && quoted.message) {
            const type = Object.keys(quoted.message)[0]; // safe check
            if (type === 'imageMessage') {
                imageBuffer = await getBuffer(quoted);
            }
        }

        // 2️⃣ Check if user sent image directly with command
        if (!imageBuffer && m.message) {
            const type = Object.keys(m.message)[0]; // safe check
            if (type === 'imageMessage') {
                imageBuffer = await getBuffer(m);
            }
        }

        // 3️⃣ If no image found, send error
        if (!imageBuffer) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ Please send or reply to an image to set as group profile picture.");
        }

        // 4️⃣ Update group profile picture
        await conn.groupUpdateProfilePicture(from, imageBuffer);
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        await reply("✅ Group profile picture updated successfully!");

    } catch (e) {
        console.error("Error in setgpp:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ Error: ${e.message}`);
    }
});
