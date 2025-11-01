const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "online",
    alias: ["whosonline", "onlinemembers"],
    desc: "Check who's online in the group (Admins & Owner only)",
    category: "main",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, fromMe, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in a group!");
        if (!isCreator && !isAdmins && !fromMe) return reply("❌ Only bot owner and group admins can use this command!");

        // Send waiting message
        const waitMsg = await conn.sendMessage(from, { text: "🔄 Scanning for online members... Please wait 15-20 seconds." }, { quoted: mek });

        const onlineMembers = new Set();
        const groupData = await conn.groupMetadata(from);

        // Subscribe to presence updates
        for (const participant of groupData.participants) {
            conn.presenceSubscribe(participant.id).catch(() => {});
        }

        // Presence update handler
        const presenceHandler = (json) => {
            for (const id in json.presences) {
                const presence = json.presences[id]?.lastKnownPresence;
                if (['available', 'composing', 'recording', 'online'].includes(presence)) {
                    onlineMembers.add(id);
                }
            }
        };

        conn.ev.on('presence.update', presenceHandler);

        // Wait 15 seconds to collect online members
        await sleep(15000);
        conn.ev.off('presence.update', presenceHandler);

        // Delete waiting message
        await conn.sendMessage(from, { react: { text: '✅', key: waitMsg.key } });
        await conn.sendMessage(from, { delete: waitMsg.key });

        if (onlineMembers.size === 0) {
            return reply("⚠️ Couldn't detect any online members. They might be hiding their presence.");
        }

        const onlineArray = Array.from(onlineMembers);
        let currentText = `🟢 *Online Members* (${onlineArray.length}/${groupData.participants.length}):\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n`;

        // Send empty message first for live updates
        const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        // Send online members line by line
        for (let i = 0; i < onlineArray.length; i++) {
            const memberId = onlineArray[i];
            currentText += `${i + 1}. @${memberId.split('@')[0]}\n`;
            await sleep(1000); // 1 second delay for typing effect
            await conn.relayMessage(from, {
                protocolMessage: {
                    key: msg.key,
                    type: 14,
                    editedMessage: { conversation: currentText }
                }
            }, {});
        }

        // Optionally add footer
        currentText += `\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n*👑 BILAL-MD WHATSAPP BOT 👑*`;
        await conn.relayMessage(from, {
            protocolMessage: {
                key: msg.key,
                type: 14,
                editedMessage: { conversation: currentText }
            }
        }, {});

        // Mention all online members
        await conn.sendMessage(from, { text: " ", mentions: onlineArray });

    } catch (e) {
        console.error("Error in online command:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message}`);
    }
});
