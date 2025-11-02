const { cmd } = require('../command');
const antilink = require('../plugins/antilink'); // path to your plugin file

// Flag to track plugin state
let antilinkEnabled = true;

cmd({
    pattern: "antilink",
    alias: ["antilinkmode"],
    desc: "Turn anti-link plugin on/off",
    category: "group",
    react: "🛡️",
    filename: __filename
}, async (conn, mek, m, { from, args, isGroup, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command works only in groups!");
        if (!isAdmins) return reply("❌ Only admins can use this command!");

        const action = args[0]?.toLowerCase();
        if (!action || !["on","off"].includes(action)) {
            return reply("Usage: *.antilink on* or *.antilink off*");
        }

        // Toggle flag
        antilinkEnabled = action === "on";

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
        reply(`🛡️ Anti-link plugin is now *${antilinkEnabled ? "ON" : "OFF"}*`);

    } catch (e) {
        console.error(e);
        reply("❌ Error toggling anti-link plugin!");
    }
});

// Export a function that the plugin can check
module.exports = {
    isAntilinkEnabled: () => antilinkEnabled
};
