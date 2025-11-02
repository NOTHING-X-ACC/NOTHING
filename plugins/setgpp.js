const { cmd } = require('../command');
const { getBuffer } = require('../lib/functions');

cmd({
    pattern: "setgpp",
    alias: ["setgrouppic", "grouppp"],
    desc: "Change group profile picture (reply image / send image / mention user)",
    category: "group",
    react: "😒",
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
            const type = Object.keys(quoted.message)[0];
            if (type === 'imageMessage') {
                imageBuffer = await getBuffer(quoted);
            }
        }

        // 2️⃣ Check if user sent image directly
        if (!imageBuffer && m.message) {
            const type = Object.keys(m.message)[0];
            if (type === 'imageMessage') {
                imageBuffer = await getBuffer(m);
            }
        }

        // 3️⃣ Check if user mentioned someone
        if (!imageBuffer && m.mentionedJid && m.mentionedJid.length > 0) {
            const mentionedId = m.mentionedJid[0]; // first mentioned user

            // Fetch last 50 messages in the group
            const messages = await conn.fetchMessages(from, { limit: 50 });

            // Find last image from mentioned user
            const lastImage = messages.reverse().find(msg => 
                (msg.key.participant === mentionedId || msg.key.remoteJid === mentionedId) &&
                msg.message?.imageMessage
            );

            if (!lastImage) {
                await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
                return reply("❌ Could not find any image from the mentioned user in recent messages.");
            }

            imageBuffer = await getBuffer(lastImage);
        }

        // 4️⃣ If no image found, error
        if (!imageBuffer) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ Please send, reply to an image, or mention a user who sent an image recently.");
        }

        // 5️⃣ Update group profile picture
        await conn.groupUpdateProfilePicture(from, imageBuffer);
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        return reply("✅ Group profile picture updated successfully!");

    } catch (e) {
        console.error("Error in setgpp:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ Error: ${e.message}`);
    }
});
