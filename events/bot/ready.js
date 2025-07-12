const Discord = require('discord.js');


module.exports = {
    name:"ready",
    run:async(client) => {console.clear();

        console.log('\x1b[37m%s\x1b[0m', `                               > Estou online em ${client.user.username} <`);
        console.log('\x1b[37m%s\x1b[0m', `                                > Estou em ${client.guilds.cache.size}, Servidores XD <`);
        console.log('\x1b[37m%s\x1b[0m', `                                 > Tenho ${client.users.cache.size} Amiguinhus :D <`);
        console.log('\x1b[37m%s\x1b[0m', `1.0.0`);
        

        // Status Aether
        const messages = [
            `☁️ AETHER — Essencial como o ar!`,
            `🌌 O elemento que mantém seu servidor vivo.`,
            `🔹 Automação • Moderação • Organização`,
            `💠 Seu servidor, conectado no mais alto nível.`,
            `✨ Minimalista, elegante e poderoso.`,
            `#9D4EDD — Roxo Éter`,
            `#00B4D8 — Azul Plasma`,
            `🚀 Powered by AETHER`  
        ];

        let position = 0;

        setInterval(() => client.user.setPresence({
            activities: [{
                name: `${messages[position++ % messages.length]}`,
                type: Discord.ActivityType.Custom
            }]
        }), 1000 * 10);

        client.user.setStatus("online");
    }
}