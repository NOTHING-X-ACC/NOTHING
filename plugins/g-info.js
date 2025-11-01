const config = require('../config')
const { cmd } = require('../command')
const { getBuffer, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "ginfo",
    react: "🥳",
    alias: ["groupinfo"],
    desc: "Get group informations.",
    category: "group",
    filename: __filename
},
async(conn, mek, m,{from, participants, isGroup, isAdmins, isDev, isBotAdmins, reply}) => {
try{
    const msr = (await fetchJson('https://raw.githubusercontent.com/JawadTech3/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg

    if (!isGroup) return reply(msr.only_gp)
    if (!isAdmins && !isDev) return reply(msr.you_adm)
    if (!isBotAdmins) return reply(msr.give_adm)

    let ppUrl;
    try { 
        ppUrl = await conn.profilePictureUrl(from, 'image') 
    } catch { 
        ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png'; 
    }

    // Send group profile picture first
    await conn.sendMessage(from, { image: { url: ppUrl }, caption: "*GROUP INFO LOADED 🥳*" }, { quoted: mek });

    const metadata = await conn.groupMetadata(from)
    const groupAdmins = participants.filter(p => p.admin)
    const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')

    let inviteLink = await conn.groupInviteCode(from)
    let groupLink = `https://chat.whatsapp.com/${inviteLink}`

    let ownerJid = metadata.owner
    let ownerName = participants.find(p => p.id === ownerJid)?.name || ownerJid.split('@')[0]

    const descLines = (metadata.desc?.toString().split('\n') || ['No description']).map(l => l.trim()).filter(l => l)
    const lines = [
        `*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n\t*👑 GROUP INFORMATION 👑*\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*`,
        `*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n*👑 GROUP NAME 👑*\n${metadata.subject}\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*`,
        `*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n*👑 GROUP LINK 👑*\n${groupLink}\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*`,
        `*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n*👑 MEMBERS :❯ ${metadata.participants.length}*\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*`,
        `*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n*👑 GROUP DESCRIPTION 👑*\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*`
    ];

    // Start with empty message
    let currentText = "";
    const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

    // Slowly add group info lines
    for (const line of lines) {
        currentText += line + "\n\n";
        await sleep(1000); // 1 second delay
        await conn.relayMessage(from, {
            protocolMessage: {
                key: msg.key,
                type: 14,
                editedMessage: { conversation: currentText }
            }
        }, {});
    }

    // Add description line by line
    for (const dLine of descLines) {
        currentText += dLine + "\n";
        await sleep(1000);
        await conn.relayMessage(from, {
            protocolMessage: {
                key: msg.key,
                type: 14,
                editedMessage: { conversation: currentText }
            }
        }, {});
    }

    // Add admins
    currentText += `\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n*👑 GROUP ADMINS 👑*\n${listAdmin}\n\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*\n*👑 BILAL-MD WHATSAPP BOT 👑*\n*✧ ▬▭▬▭▬▭▬▭▬▭▬▭▬ ✧*`
    await conn.relayMessage(from, {
        protocolMessage: {
            key: msg.key,
            type: 14,
            editedMessage: { conversation: currentText }
        }
    }, {});

} catch (e) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
    console.log(e)
    reply(`❌ *Error Accurated !!*\n\n${e}`)
}
})
