const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const owner = require("../../config.json")

module.exports = {
    name: "set-prefixo",
    description: "[🤖] Definir prefixo!",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        // Button
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("configprefixo")
                    .setEmoji("1268839622671208490")
                    .setLabel("Configurar Prefixo")
                    .setStyle(ButtonStyle.Secondary)
            )

        const embed = new EmbedBuilder()
            .setDescription(`Olá, ${interaction.user} ! Seja bem vindo.\n * Oque deseja fazer?`)
            .setTitle(`${interaction.guild.name} | Prefix! `)
            .setColor("#800080")


        interaction.update({ embeds: [embed], components: [row], ephemeral: true })


    }
}