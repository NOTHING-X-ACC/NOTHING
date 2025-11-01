const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "unmute",
    alias: ["groupunmute", "opengc", "gcopen", "open"],
    react: "😃",
    desc: "Unmute the group (Everyone can send messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins, reply, react }) => {
    try {
        if (!isGroup) {
            react("😫"); // react add
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN 😎*");
        }
        if (!isAdmins) {
            react("😥"); // react add
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI 🥺 AP ADMIN NAHI HO ☹️*");
        }
        if (!isBotAdmins) {
            react("☺️"); // react add
            return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️*");
        }

        await conn.groupSettingUpdate(from, "not_announcement");
        react("😃"); // success react
        reply("*YEH GROUP AB OPEN HO CHUKA HAI 🥺* \n*AB AP SAB IS GROUP ME CHAT KAR SAKTE HAI 😇🌺* \n*AUR HA 🥺 IS GROUP ME LINKS ALLOWED NAHI TO LINK HARGIZ NAHI BHEJNA IS GROUP OK ☺️🌹*");
    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        react("❌"); // error react
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
