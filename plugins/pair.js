const { cmd } = require('../command');
const axios = require('axios');

// ===============================
// Pair 1
// ===============================
cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "☺️",
    desc: "Get pairing code for BILAL-MD bot",
    category: "download",
    use: ".pair +92xxxxxx",
    filename: __filename
}, async (conn, mek, m, { q, senderNumber, reply }) => {
    try {
        const phoneNumber = q ? q.trim() : senderNumber;

        if (!phoneNumber || !phoneNumber.match(/^\+?\d{10,15}$/)) {
            return await reply("*APKO BILAL-MD BOT KA PAIR CODE CHAHYE ☺️🌹* \n *TO ESE LIKHOO AP 😊🌺* \n\n *❮PAIR +923078071982❯* \n\n*IS NUMBER KI JAGAH AP APNA NUMBER LIKHNA 😊🌹* \n *TO APKE NUMBER PAR BILAL-MD BOT KA PAIR CODE BAN HO JAYE GA*");
        }

        // Remove + sign for API
        const cleanNumber = phoneNumber.replace(/\D/g, "");

        // Call API endpoint
        const res = await axios.get(`https://bilal-md-wa-bot-d86d68ab0755.herokuapp.com/code?number=${cleanNumber}`);
        const code = res.data?.code;

        if (!code) {
            return await reply("*APKE NUMBER PER PAIR BILAL-MD BOT KA PAIR CODE CONNECT NAHI HHO RAHA 🥺❤️*");
        }

        const doneMessage = "*BILAL-MD BOT KA PAIR CODE APKE NUMBER E SATH CONNECT HO CHUKA HAI 🥰 AP IS PAIR CODE KO APNE WHATSAPP ME 30 SECONDS K ANDAR LINK KAR LO 🥺 WARNA CODE EXPIRE HO JAYE GA*\n*AGAR EXPIRE B HO JAYE TO AP DUBARA ❮PAIR❯ COMMAND KA ISTEMAL KAR KE DUBARA PAIR CODE NEW BANA SAKTE HAI 🥰💓♥️*";
        await reply(`${doneMessage}\n\n*👑 BILAL-MD WHATSAPP BOT 👑*`);

        // Optional: send the code again after 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        await reply(`${code}`);

    } catch (err) {
        console.error("*DUBARA KOSHISH KARE ☹️*", err);
        await reply("❌ Error pairing code.");
    }
});
