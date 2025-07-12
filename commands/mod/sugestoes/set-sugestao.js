const Discord = require("discord.js")
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "set-sugestão",
    description: "Defina o canal onde as sugestões serão enviadas.",
    type: 1,
    options: [
        {
            name: "canal_sugestão",
            description: "Canal onde será enviado as sugestões",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true
        },
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("#FF4D4D")
                        .setDescription(`❌ | ${interaction.user}, você precisa da permissão GERENCIAR SERVIDOR para usar este comando!`)
                        .setFooter({ text: "AETHER • Sugestões Cósmicas" })
                ],
                ephemeral: true
            });
        }
        const canal = interaction.options.getChannel("canal_sugestão");
        if (!canal || canal.type !== Discord.ChannelType.GuildText) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("#FF4D4D")
                        .setDescription(`❌ | Por favor, selecione um canal de texto válido.`)
                        .setFooter({ text: "AETHER • Sugestões Cósmicas" })
                ],
                ephemeral: true
            });
        }
        try {
            await db.set(`canalsugestao_${interaction.guild.id}`, canal.id);
            await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("#9D4EDD")
                        .setDescription(`☁️ Canal de sugestões definido como ${canal}`)
                        .setFooter({ text: "AETHER • Sugestões Cósmicas" })
                ],
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("#FF4D4D")
                        .setDescription(`❌ | Ocorreu um erro ao tentar definir o canal de sugestões.\nMotivo: ${error.message || 'Erro desconhecido.'}`)
                        .setFooter({ text: "AETHER • Sugestões Cósmicas" })
                ],
                ephemeral: true
            });
        }
    }
}