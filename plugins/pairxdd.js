const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pairxdd",
    alias: ["getpair", "clonebot"],
    react: "🌹",
    desc: "Get pairing code for WHITESHADOW-MD bot",
    category: "download",
    use: ".pair +947XXXXXXXX",
    filename: __filename
}, async (conn, mek, m, { q, senderNumber, reply }) => {
    try {
        // 🥺 React at start
        await m.react("🥺");

        const phoneNumber = q ? q.trim() : senderNumber;

        if (!phoneNumber || !phoneNumber.match(/^\+?\d{10,15}$/)) {
            await m.react("🥺");
            return await reply("*APKO BILAL-MD BOT KA PAIR CODE CHAHYE ☺️🌹* \n *TO ESE LIKHOO AP 😊🌺* \n\n *❮PAIR +923078071982❯* \n\n*IS NUMBER KI JAGAH AP APNA NUMBER LIKHNA 😊🌹* \n *TO APKE NUMBER PAR BILAL-MD BOT KA PAIR CODE BAN HO JAYE GA*");
        }

        const cleanNumber = phoneNumber.replace(/\D/g, "");

        // ⏳ Send waiting message
        const waitingMsg = await conn.sendMessage(m.chat, { 
            text: "*BOT KA PAIR CODE APKE WHATSAPP NUMBER KE SATH CONNECT HO RAHA HAI....☺️🌹*" 
        }, { quoted: m });
        await m.react("😃");

        // 🌐 Fetch pairing code
        const res = await axios.get(`https://whiteshadow-8182be1f6ed6.herokuapp.com/code?number=${cleanNumber}`);
        const code = res.data?.code;

        if (!code) {
            await m.react("☹️");
            await conn.deleteMessage(m.chat, { id: waitingMsg.key.id });
            return await reply("*APKE NUMBER PER PAIR CODE CONNECT NAHI HO RAHA ☹️*");
        }

        // 🗑️ Delete waiting message
        await conn.deleteMessage(m.chat, { id: waitingMsg.key.id });

        // 🥰 React to original command (☺️)
        await m.react("🥰");

        // 💬 Send pairing code
        const codeMsg = await conn.sendMessage(m.chat, { 
            text: `\`\`\`${code}\`\`\`` 
        }, { quoted: m });

        // ✅ Send confirmation message
        await conn.sendMessage(m.chat, { 
            text: "*BILAL-MD BOT KA PAIR CODE APKE NUMBER E SATH CONNECT HO CHUKA HAI 🥰🌹*\n*AP IS PAIR CODE KO APNE WHATSAPP ME 30 SECONDS K ANDAR LINK KAR LO 🥺*\n*WARNA CODE EXPIRE HO JAYE GA*\n*AGAR EXPIRE B HO JAYE TO AP DUBARA ❮PAIR❯ COMMAND KA ISTEMAL KAR KE DUBARA PAIR CODE NEW BANA SAKTE HAI 🥰💓♥️*\n\n*👑 BILAL-MD WHATSAPP BOT 👑*"
        }, { quoted: m });

    } catch (err) {
        console.error("*DUBARA KOSHISH KARE 🥺❤️*", err);
        await m.react("😔");
        await reply("*DUBARA KOSHISH KARE 🥺*");
    }
});
