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
            return await reply("❌ Please provide a valid phone number with country code\nExample: .pair +94XXXXXXXXX");
        }

        const cleanNumber = phoneNumber.replace(/\D/g, "");

        // ⏳ Send waiting message
        const waitingMsg = await conn.sendMessage(m.chat, { 
            text: "⏳ Please wait... generating your pairing code 💫" 
        }, { quoted: m });
        await m.react("⏳");

        // 🌐 Fetch pairing code
        const res = await axios.get(`https://whiteshadow-8182be1f6ed6.herokuapp.com/code?number=${cleanNumber}`);
        const code = res.data?.code;

        if (!code) {
            await m.react("😔");
            await conn.deleteMessage(m.chat, { id: waitingMsg.key.id });
            return await reply("❌ Could not retrieve WHITESHADOW-MD pairing code.");
        }

        // 🗑️ Delete waiting message
        await conn.deleteMessage(m.chat, { id: waitingMsg.key.id });

        // 🥰 React to original command (☺️)
        await m.react("☺️");

        // 💬 Send pairing code
        const codeMsg = await conn.sendMessage(m.chat, { 
            text: `\`\`\`${code}\`\`\`` 
        }, { quoted: m });

        // ✅ Send confirmation message
        await conn.sendMessage(m.chat, { 
            text: "> *WHITESHADOW-MD PAIRING COMPLETED ✅*\n\nYour pairing code has been successfully generated and linked.\n\n⚠️ Use this code within 30 seconds before it expires."
        }, { quoted: m });

    } catch (err) {
        console.error("Pair1 command error:", err);
        await m.react("😢");
        await reply("❌ Error while getting WHITESHADOW-MD pairing code. Please try again later.");
    }
});
