const { cmd } = require('../command');
// ... (Your file/status setup and .antibot command remains the same) ...

// === [ 🕵️ ADVANCED METADATA + COMMAND KICK HANDLER ] ===
const commandPrefixes = ['.', '!', '/', '#', '>', '$', '?', '@']; 
// Suspicious patterns jo kuch bot frameworks/IDs mein hote hain (e.g., Baileys me 1.msg se shuru hona)
const suspiciousIdPatterns = [
    // Example patterns for very specific old bots (if applicable)
    // /^3E/, /^4E/, /^MD/,
    // Baileys IDs for message keys can be large strings, so this is for sender JID.
]; 

cmd({
    on: "message"
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!m.isGroup || !antibotStatus[from]?.enabled) return;
        if (m.key.fromMe) return; 

        const sender = m.key.participant;
        if (!sender) return;

        const text = m.text?.trim() || '';

        // Agar user group admin hai to usko ignore karo
        if (isAdmins) return; 
        
        // 1. Command Check: Kya message command hai?
        const isCommandMessage = commandPrefixes.some(prefix => text.startsWith(prefix));

        // 2. Metadata Check: Kya sender ki JID in suspicious patterns se match karti hai?
        // Note: Sender ID (JID) usually looks like '923xx... @s.whatsapp.net'.
        const isSuspiciousJID = suspiciousIdPatterns.some(rx => rx.test(sender)); 

        let actionReason = null;
        
        if (isCommandMessage && isSuspiciousJID) {
            actionReason = "sent a command with a suspicious ID";
        } else if (isCommandMessage) {
            // Agar koi simple user galti se command bhej de, toh use turant kick nahi karna chahiye.
            // Hum sirf log kareinge. Aap chaho toh yahan Instant Kick bhi rakh sakte ho (jaisa pehle tha).
            console.log(`[AntiBot] Warning: Non-admin ${sender.split('@')[0]} sent a command: ${text.substring(0, 15)}`);
            return;
        }

        // --- KICK ACTION ---
        if (actionReason) {
            console.log(`\n🚨 ANTI-BOT ACTION! (Method 2) Sender: ${sender}, Reason: ${actionReason}`);
            
            if (isBotAdmins) {
                // KICK HO JAYEGA
                await conn.groupParticipantsUpdate(from, [sender], 'remove');
                await conn.sendMessage(from, {
                    text: `🚨 *Bot-like account removed automatically!*\n@${sender.split('@')[0]} was removed for ${actionReason} 🚫.`,
                    mentions: [sender]
                });
            } else {
                // WARN KAREGA
                await conn.sendMessage(from, {
                    text: `⚠️ I detected a *Suspicious Account* activity, but I'm not admin.\nPlease make me *admin* to auto-remove bots 😇`
                });
            }
        }

    } catch (err) {
        console.error("❌ AntiBot Handler Error:", err);
    }
});

// === [ 🧠 COMMAND: .antibot on/off ] ===
cmd({
    pattern: "antibot",
    alias: ["botblock", "banbot", "abot", "antbot"],
    desc: "Enable or disable the AntiBot system in a group.",
    category: "group",
    react: "🤖",
    use: ".antibot on/off",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, reply }) => {
    if (!isGroup) return reply("❌ This command only works in groups.");
    if (!isAdmins) return reply("⛔ Only *group admins* can use this command.");

    const args = q.trim().toLowerCase();
    if (!antibotStatus[from]) antibotStatus[from] = { enabled: false };

    if (args === "on") {
        antibotStatus[from].enabled = true;
        saveStatus();
        // Reply message yahan change hota hai based on which logic you use (Flood, Command, etc.)
        return reply("✅ *AntiBot has been activated in this group!*\n\nBots sending high-speed messages or commands will be removed! 😎"); 
    } else if (args === "off") {
        antibotStatus[from].enabled = false;
        saveStatus();
        return reply("🚫 *AntiBot has been deactivated in this group.*");
    } else {
        return reply(`📊 *AntiBot Status:* ${antibotStatus[from].enabled ? "✅ ON" : "❌ OFF"}\n\nUse:\n.antibot on — to enable\n.antibot off — to disable`);
    }
});
    
