const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "checkonline",
    alias: ["onlinelist", "listonline", "onmembers"],
    desc: "Check online/offline member counts in the group",
    category: "main",
    react: "🥳",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, fromMe, reply }) => {
    try {
        // Group check
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '😇', key: mek.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KARE 😇* ");
        }

        // Admin/creator check
        if (!isCreator && !isAdmins && !fromMe) {
            await conn.sendMessage(from, { react: { text: '😎', key: mek.key } });
            return reply("*YEH COMMAND SIRF MERE LIE AUR ADMINS KE LIE HAI 😎*");
        }

        // Send waiting message
        const waitMsg = await conn.sendMessage(from, { text: "*ONLINE OFFLINE MEMBERS KI LIST BAN RAHI HAI...😃*" }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '😃', key: waitMsg.key } });

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
        await sleep(15000); // Wait 15 sec for online collection
        conn.ev.off('presence.update', presenceHandler);

        // Delete waiting message and react
        await conn.sendMessage(from, { react: { text: '☺️', key: waitMsg.key } });
        await conn.sendMessage(from, { delete: waitMsg.key });

        // Prepare counts only
        const onlineCount = onlineMembers.size;
        const offlineCount = groupData.participants.length - onlineCount;
        const message = `*👑 ONLINE MEMBERS :❯ ❮${onlineCount}❯*\n*👑 OFFLINE MEMBERS :❯ ❮${offlineCount}❯*\n\n*👑 BILAL-MD WHATSAPP BOT 👑*`;

        // Send final message
        await conn.sendMessage(from, { text: message });

    } catch (e) {
        console.error("*DUBARA KOSHISH KARE 😔*", e);
        await conn.sendMessage(from, { react: { text: '😔', key: mek.key } });
        reply(`❌ *Error Occurred !!*\n\n${e.message}`);
    }
});
