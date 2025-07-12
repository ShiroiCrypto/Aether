const { ApplicationCommandType, EmbedBuilder } = require("discord.js"); // Chamando a Dependencia discord.js
const cores = require("../../../colors.json");
const embeds = require("../../../embed.json");


module.exports = {
    name:"ping", 
    description:"[🤖] Veja o PING do bot!", 
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => { 
        const cor = cores.roxo_eter || "#9D4EDD";
        const ping = client.ws.ping;
        const embedCalculando = new EmbedBuilder()
            .setColor(cor)
            .setTitle("☁️ Calculando o Ping Cósmico...")
            .setDescription(`Olá ${interaction.user}, aguarde um momento enquanto calculo meu ping através do éter...`)
            .setFooter({ text: "AETHER • Sistema Cósmico" });

        await interaction.reply({ embeds: [embedCalculando], ephemeral: true });

        setTimeout(() => {
            const embedPing = new EmbedBuilder()
                .setColor(cor)
                .setTitle("🌌 Ping Cósmico do Aether")
                .setDescription(`🔹 **Ping:** [1m${ping}ms[0m\n🔹 **Latência Estelar:** ${(Date.now() - interaction.createdTimestamp)}ms`)
                .setFooter({ text: "AETHER • Sistema Cósmico" })
                .setTimestamp();
            interaction.editReply({ embeds: [embedPing] });
        }, 1200);
    }
}