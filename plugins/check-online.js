const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "checkonline",
    alias: ["whosonline", "onlinemembers"],
    desc: "Check who's online in the group (Admins & Owner only)",
    category: "main",
    react: "🥺",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, fromMe, reply }) => {
    try {
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ This command can only be used in a group!");
        }

        if (!isCreator && !isAdmins && !fromMe) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ Only bot owner and group admins can use this command!");
        }

        const waitMsg = await conn.sendMessage(from, { text: "🔄 Scanning for online members... Please wait 15-20 seconds." }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '⏳', key: waitMsg.key } });

        const onlineMembers = new Set();
        const groupData = await conn.groupMetadata(from);

        // Subscribe to presence updates
        for (const participant of groupData.participants) {
            conn.presenceSubscribe(participant.id).catch(() => {});
        }

        const presenceHandler = (json) => {
            for (const id in json.presences) {
                const presence = json.presences[id]?.lastKnownPresence;
                if (['available', 'composing', 'recording', 'online'].includes(presence)) {
                    onlineMembers.add(id);
                }
            }
        };

        conn.ev.on('presence.update', presenceHandler);
        await sleep(15000);
        conn.ev.off('presence.update', presenceHandler);

        // Delete waiting message and react success
        await conn.sendMessage(from, { react: { text: '☺️', key: waitMsg.key } });
        await conn.sendMessage(from, { delete: waitMsg.key });

        if (onlineMembers.size === 0) {
            await conn.sendMessage(from, { react: { text: '⚠️', key: mek.key } });
            return reply("⚠️ Couldn't detect any online members. They might be hiding their presence.");
        }

        const onlineArray = Array.from(onlineMembers);
        let mentions = []; // This will store all IDs for WhatsApp tagging
        let currentText = `*👑 ONLINE MEMBERS :❯ ❮${onlineArray.length}❯*\n*👑 OFFLINE MEMBERS :❯ ❮${groupData.participants.length - onlineArray.length}❯*\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n`;

        // Send empty message first for live updates
        const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        // Add online members line by line with tagging
        for (let i = 0; i < onlineArray.length; i++) {
            const memberId = onlineArray[i];
            const memberObj = groupData.participants.find(p => p.id === memberId);
            const memberName = memberObj?.name || memberId.split('@')[0];

            currentText += `${i + 1}. @${memberName}\n`;
            mentions.push(memberId); // Push participant ID for actual tag

            await sleep(1000);
            await conn.relayMessage(from, {
                protocolMessage: {
                    key: msg.key,
                    type: 14,
                    editedMessage: { conversation: currentText }
                }
            }, {});
        }

        // Add footer
        currentText += `\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n*👑 BILAL-MD WHATSAPP BOT 👑*`;
        await conn.relayMessage(from, {
            protocolMessage: {
                key: msg.key,
                type: 14,
                editedMessage: { conversation: currentText }
            }
        }, {});

        // Send final message with mentions array to tag all
        await conn.sendMessage(from, { text: "Online members listed above", mentions });

    } catch (e) {
        console.error("Error in online command:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ *Error Occurred !!*\n\n${e.message}`);
    }
});
