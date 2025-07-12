const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Discord = require("discord.js");
const client = require(`../../index.js`);

client.on("guildMemberAdd", async (member) => {
    try {
        const autoRoleId = await db.get(`${member.guild.id}.AutoRole`);

        if (!autoRoleId) return;

        const role = member.guild.roles.cache.get(autoRoleId);
        if (role) {
            await member.roles.add(role);
        } else {
            console.log(`[ERRO DETECTADO] Cargo não encontrado no cache.`);
        }
    } catch (error) {
        console.log(`[ERRO DETECTADO] ${error}`);
    }
}); 