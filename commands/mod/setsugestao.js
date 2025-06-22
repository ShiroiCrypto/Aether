const Discord = require("discord.js")
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "setsugestão",
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
    permissions: {},
    run: async (client, interaction, args) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            return await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`:x: | Olá ${interaction.user}, você não possui permissão para utilizar este comando.`)
                        .setColor("Red")
                ],
                ephemeral: true
            });
        }
        const canal = interaction.options.getChannel("canal_sugestão");

        if (!canal || canal.type !== Discord.ChannelType.GuildText) {
            return await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`:x: | Por favor, selecione um canal de texto válido.`)
                        .setColor("Red")
                ],
                ephemeral: true
            });
        }

        try {
            await db.set(`canalsugestao_${interaction.guild.id}`, canal.id);
            await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`✅ | Canal de sugestões definido como ${canal}`)
                        .setColor("Green")
                ],
                ephemeral: true
            });
        } catch (error) {
            console.error(`[setsugestão] Erro ao definir canal de sugestões:`, error);
            await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`:x: | Ocorreu um erro ao tentar definir o canal de sugestões. Tente novamente ou contate o suporte.`)
                        .setColor("Red")
                ],
                ephemeral: true
            });
        }
    }
}