const { cmd } = require('../command');
const axios = require('axios');

const api = "https://facebook-downloader-chamod.vercel.app/api/fb";

cmd({
    pattern: "fbdx",
    alias: ["fbvideo"],
    react: "🥺",
    desc: "Download FB video HD/SD",
    category: "download",
    use: ".fb <link>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    if (!q) return reply("*AP KO KOI FACEBOOK VIDEO DOWNLOAD KARNI HAI 🤔*\n*TO LINK BHEJO:* `.fb <link>`");

    try {
        const fb = await axios.get(`${api}?url=${encodeURIComponent(q)}`);
        const data = fb.data;

        if (!data?.download?.videos || data.download.videos.length === 0) {
            return reply("*Video nahi mila 😔*");
        }

        const videos = data.download.videos;

        // Caption + HD/SD options
        let caption = "*FB VIDEO KA LINK MIL GAYA 😇*\n\n*PEHLE IS MSG KO MENTION KARO 🥺 AUR PHIR NUMBER LIKHO:*\n";
        videos.forEach((v, i) => {
            caption += `\n❮${i+1}❯ ${v.quality}`;
        });
        caption += "\n\n*BILAL-MD WHATSAPP BOT*";

        const sentMsg = await conn.sendMessage(from, {
            image: { url: data.metadata.thumbnail },
            caption
        }, { quoted: m });

        const messageID = sentMsg.key.id;

        // Listen for number reply
        conn.ev.on("messages.upsert", async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;

            const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const senderID = receivedMsg.key.remoteJid;
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

            if (!isReplyToBot) return;
            await conn.sendMessage(senderID, { react: { text: '☺️', key: receivedMsg.key } });

            const choice = parseInt(receivedText.trim());
            if (!choice || choice < 1 || choice > videos.length) return;

            const video = videos[choice - 1];

            switch (choice) {
                case 1: // simple video
                    await conn.sendMessage(senderID, {
                        video: { url: video.link },
                        mimetype: "video/mp4"
                    }, { quoted: receivedMsg });
                    break;

                case 2: // file video
                    await conn.sendMessage(senderID, {
                        document: { url: video.link },
                        mimetype: "video/mp4",
                        fileName: `${data.metadata.title}.mp4`
                    }, { quoted: receivedMsg });
                    break;
            }
        });

    } catch (err) {
        console.error("*FB VIDEO DOWNLOAD ERROR*", err);
        reply("*Kuch gadbad ho gai, video download nahi ho saka 😔*");
    }
});
