const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
    pattern: "repo",
    alias: ["sc", "script", "infobot", "r", "re", "rep", "repos", "botlink", "?"],
    desc: "Fetch GitHub repository information",
    react: "☺️",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = "https://github.com/BilalTech05/BILAL-MD";
    const channelLink = "https://whatsapp.com/channel/0029VbBXuGe4yltMLngL582d";

    try {
        const cleanUrl = githubRepoURL.replace(/\/+$/, "");
        const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("⚠️ Invalid GitHub repo URL set in code!");

        const [, username, repoName] = match;
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
        const repoData = response.data;

        // Caption style
        const style = `*BILAL-MD WHATSAPP BOT 😇 PAKISTAN KA PEHLA BOT HAI ☺️ JO URDU ZUBAN ME BANAYA KIA GAYA HAI 😊♥️*
*👑 USER :❯ ${repoData.owner.login}*
*👑 STARS :❯ ${repoData.stargazers_count}*
*👑 FORKS :❯ ${repoData.forks_count}*

*BILAL-MD WHATSAPP BOT*

*ALL ERRORS FIXED*
*YT VIDEO DOWNLOADING*
*YT AUDIO DOWNLOADING*
*TIKTOK DOWNLOADING*
*FACEBOOK DOWNLOADING*
*APK DOWNLOADING*
*ALL GROUP COMMANDS FIXED + WORKING*
*VV OPENER*

*AND MANY MORE COMMANDS ALL WORKING*

*BILAL-MD PAKISTAN KA PEHLA BOT HAI JO URDU ME BANAYA GAYA HAI ☺️♥️*

*IS BOT ME ALL COMMANDS WORKING HAI KOI COMMAND FAKE NAI ☺️❤️*


*BAKI KISI NE BOT LAGWANA HA*

*×××××××××××××××××××*
*<• PAID SERVICE •>*
*• ××××❮ 150 ❯×××× •*
*×××××××××××××××××××*

ME LAGA KAR DE GE *ONE MONTH* CHALE GA INSHALLAH ☺️

*AGAR MONTH SE PEHLE OFF HO GAYA TO DUBARA LAGA DE GE 🥰 FREE ME  ME LAGA KER DE GE KOI PESE NAHI LE GE ☺️❤️*

*TO JIS NE BHI BOT LAGWANA HAI MSG KROO*

*150 PER BOT ONE MONTH GUARANTEE FREE 🥳*

*ALL COMMANDS WORKING*

🥳🥳🥳🥳🥳🥳🥳🥳
*CONTACT FOR BOT😍*
☺️ *❮+923078071982❯* ☺️
☺️ *❮+22553229710❯* ☺️


*👑 OWNER INFORMATION 👑*
*https://akaserein.github.io/Bilal/*

*👑 BILAL-MD REPO 👑*
*https://bilal-mdx-start.vercel.app/*

*👑 SUPPORT CHANNEL 👑*
*https://whatsapp.com/channel/0029VbBXuGe4yltMLngL582d*

*👑SUPPORT GROUP 👑*
https://chat.whatsapp.com/BwWffeDwiqe6cjDDklYJ5m?mode=hqrt2*`;

        // ✅ Send only image + caption (no buttons)
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kunzpz.png" },
            caption: style,
            footer: "👑 BILAL-MD BOT 👑",
            headerType: 4
        }, { quoted: mek });

    } catch (error) {
        console.error("*BILAL-MD BOT KI REPO NAHI MILI 🥺*", error);
        reply(`ERROR ${error.message}`);
    }
});
