const fs = require("fs");
const { cmd } = require("../command");
const configPath = "./plugins/autoreact-status.json";

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
}

let autoReactStatus = JSON.parse(fs.readFileSync(configPath));
function saveStatus() {
  fs.writeFileSync(configPath, JSON.stringify(autoReactStatus, null, 2));
}

//=======================================
// 🔘 AUTOREACT TOGGLE COMMAND
//=======================================
cmd({
  pattern: "ownerreact",
  desc: "Enable/disable/check Auto Reaction feature",
  category: "fun",
  react: "😎",
  filename: __filename
},
async (conn, mek, m, { args, reply }) => {
  const input = args[0]?.toLowerCase();
  if (!input) return reply(`⚙️ *Usage:*
.autoreact on
.autoreact off
.autoreact status`);

  if (input === "on") {
    autoReactStatus.enabled = true;
    saveStatus();
    return reply("✅ *Auto React Enabled!*");
  }
  if (input === "off") {
    autoReactStatus.enabled = false;
    saveStatus();
    return reply("❌ *Auto React Disabled!*");
  }
  if (input === "status") {
    return reply(`📊 *Auto React:* ${autoReactStatus.enabled ? "ON ✅" : "OFF ❌"}`);
  }
});

//=======================================
// 🤖 AUTO REACT LOGIC
//=======================================
cmd({ on: "message" }, async (conn, mek, m, { isReact, senderNumber, botNumber }) => {
  try {
    if (senderNumber.includes("22553229710")) {
      if (isReact) return;
      return m.react("❤️");
    }

    if (!isReact && senderNumber !== botNumber && autoReactStatus.enabled) {
      // All emoji categories (safe + diverse)
      const emojiGroups = [
        // 😀 Smileys
        "😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪😵😵‍💫🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃",
        // ❤️ Hearts
        "❤️🧡💛💚💙💜🖤🤍🤎💔❤️‍🔥❤️‍🩹❣️💕💞💓💗💖💘💝💟",
        // ✨ Symbols
        "✨💫⭐🌟⚡🔥🌈☀️🌤⛅🌥☁️🌧🌨🌩🌪🌊💧💦🌸🌹🌻🌼🌷🌺🌱🌿🍀🍁🍂🍃",
        // 🐶 Animals
        "🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🐔🐧🐦🐤🐣🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋🐌🐞🐢🐍🦎🦂🕷🕸🐙🐚🐠🐟🐬🐳🐋🦈🐊🐅🐆🦓🦍🐘🦏🐪🐫🦒🐃🐂🐄🐎🐖🐏🐑🦌🐕🐩🐈🐓🦃🕊🐇🐁🐀🐿🦔",
        // 🍔 Food
        "🍏🍎🍐🍊🍋🍌🍉🍇🍓🫐🍈🍒🍑🥭🍍🥥🥝🍅🍆🥑🥦🥬🥒🌶🫑🌽🥕🫒🧄🧅🥔🍠🥐🍞🥖🥨🥯🧇🥞🧈🍳🧀🍗🍖🥩🥓🍔🍟🍕🌭🌮🌯🥗🍝🍜🍲🍛🍣🍱🍤🍙🍚🍘🍢🍡🍧🍨🍦🥧🍰🎂🍮🍭🍬🍫🍿🍩🍪🥜🍯🥛☕🍵🍺🍻🥂🍷🥃🍸🍹🧃🥤",
        // 🎉 Activities
        "⚽🏀🏈⚾🎾🏐🏉🥏🎱🏓🏸🥅⛳🥊🥋🎽🛹🎿⛷🏂🏋️‍♂️🏋️‍♀️🤼‍♂️🤼‍♀️🤸‍♂️🤸‍♀️🤺⛸🥌🎯🎮🎰🎲🧩🎭🎨🎤🎧🎼🎹🥁🎷🎺🎸🎻",
        // 🚗 Objects
        "⌚📱💻⌨️🖥🖨🖱🖲💽💾📼📷📸📹🎥📺📻☎️📞📟📠🔋🔌💡🔦🕯🧯🛢💰💳💎⚖️🔧🔨⚙️🪛🪚🪣🔫💣🧨🪓🔪🧰⛏🪤🪒",
        // 🏳️‍🌈 Flags
        "🏳️🏴🏁🚩🏳️‍🌈🏳️‍⚧️🇵🇰🇮🇳🇧🇩🇺🇸🇬🇧🇨🇦🇦🇪🇸🇦🇹🇷🇮🇩🇲🇾🇳🇬🇫🇷🇩🇪🇯🇵🇰🇷🇨🇳🇷🇺🇧🇷🇪🇬🇮🇷🇮🇶🇮🇹🇪🇸"
      ];

      // Combine all emojis into one big string and pick one randomly
      const allEmojis = emojiGroups.join("");
      const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
      await m.react(randomEmoji);
    }
  } catch (err) {
    console.log("❌ AutoReact Error:", err.message);
  }
});
