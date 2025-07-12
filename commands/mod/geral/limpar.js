// ...existing code...
const Discord = require("discord.js")

module.exports = {
    name: "limpar",
    description: "Limpe o canal de texto com o poder do éter.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'Número de mensagens para apagar (1-99).',
            type: Discord.ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        let numero = interaction.options.getNumber('quantidade');
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("#FF4D4D")
                        .setDescription(`❌ | ${interaction.user}, você precisa da permissão GERENCIAR MENSAGENS para usar este comando!`)
                        .setFooter({ text: "AETHER • Moderação Cósmica" })
                ],
                ephemeral: true
            });
        }
        if (parseInt(numero) > 99 || parseInt(numero) <= 0) {
            let embed = new Discord.EmbedBuilder()
                .setColor("#FF6EC7")
                .setDescription(`☁️ Use: /limpar [1 - 99]`)
                .setFooter({ text: "AETHER • Limpeza Cósmica" });
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        try {
            await interaction.channel.bulkDelete(parseInt(numero));
            let embed = new Discord.EmbedBuilder()
                .setColor("#9D4EDD")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`☁️ O canal ${interaction.channel} teve [1m${numero}[0m mensagens deletadas por ${interaction.user}.`)
                .setFooter({ text: "AETHER • Limpeza Cósmica" });
            const replyMsg = await interaction.reply({ embeds: [embed], fetchReply: true });
            setTimeout(() => {
                interaction.deleteReply().catch(() => {});
            }, 5000);
        } catch (error) {
            let erroEmbed = new Discord.EmbedBuilder()
                .setColor("#FF4D4D")
                .setDescription(`❌ | Não foi possível deletar as mensagens.\nMotivo: ${error.message || 'Erro desconhecido.'}`)
                .setFooter({ text: "AETHER • Limpeza Cósmica" });
            await interaction.reply({ embeds: [erroEmbed], ephemeral: true });
        }
    }
}