const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove"],
    react: "🙂",
    desc: "Remove a mentioned user from the group.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, args }) => {
    try {
        // Group check
        if (!isGroup) {
            await robin.sendMessage(from, { react: { text: "😐", key: mek.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KARE 😐*");
        }

        // Admin check (user)
        if (!isAdmins) {
            await robin.sendMessage(from, { react: { text: "🙄", key: mek.key } });
            return reply("*YEH COMMAND SIRF GROUP KE ADMINS 🥺 USE KAR SAKTE HAI AP ADMIN TO NAHI HO 🙄* ");
        }

        // Bot admin check
        if (!isBotAdmins) {
            await robin.sendMessage(from, { react: { text: "😎", key: mek.key } });
            return reply("*MEMBERS KO REMOVE KARNE KE LIE 🥺 PEHLE MUJHE ADMIN BANAO 😎*");
        }

        // Target user select
        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (args[0]) {
            target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        } else {
            await robin.sendMessage(from, { react: { text: "😥", key: mek.key } });
            return reply("*IS GROUP ME KISI KE MSG KO MENTION KARO 🥺 JIS KO AP NE REMOVE KARNA HAI 😇 PHIR LIKHO COMMAND ❮KICK❯ TO WO MEMBER IS GROUP SE REMOVE HO JAYE GA 😃*\n\n *AUR KISI USER KO TAG KARO ESE ☺️*\n *.KICK ❮@SOMEONE❯*\n *TO WO MEMBER IS GROUP SE REMOVE HO JAYE GA 😊🌹*");
        }

        // Group metadata check
        const groupMetadata = await robin.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

        // Prevent kicking another admin
        if (groupAdmins.includes(target)) {
            await robin.sendMessage(from, { react: { text: "☹️", key: mek.key } });
            return reply("*YEH GROUP ME ADMIN HAI 🥺 PEHLE INKO ADMIN KI POST SE DISSMISS KARE ESE ☺️* \n\n *DEMOTE ❮@ADMIN❯*\n\n *TO WO GROUP SE DISSMISS HO JAYE 🥳 GA PHIR BAD ME LIKHO COMMAND ❮KICK❯ 🥺 TO WO IS GROUP SE REMOVE HO JAYE GA 😍🌹*");
        }

        // Prevent removing self
        if (target === robin.user.id) {
            await robin.sendMessage(from, { react: { text: "😕", key: mek.key } });
            return reply("ME KHUD KO KESE REMOVE KRO 😕*");
        }

        // ✅ Kick user
        await robin.groupParticipantsUpdate(from, [target], "remove");
        await robin.sendMessage(from, { react: { text: "🙂", key: mek.key } });
        return robin.sendMessage(from, { 
            text: `*MENE INKO  @${target.split('@')[0]} IS GROUP SE REMOVE KAR DIYA 🙂❤️*`, 
            mentions: [target] 
        }, { quoted: mek });

    } catch (e) {
        console.error("*DUBARA KOSHISH KARE 😔*", e);
        await robin.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply(`ERROR : ${e.message}`);
    }
});
