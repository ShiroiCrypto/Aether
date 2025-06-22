const { EmbedBuilder, Component, ChannelSelectMenuBuilder, ChannelType, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { db, owner, tk } = require("../../database/index");

module.exports = {
    name: "interactionCreate",
    run: async (interaction) => {
        const { customId } = interaction;
        if (!customId) return;

        if (customId === "configprefixo") {
            // Modau
            const modalSay = new ModalBuilder()
            .setCustomId('modal_desc_say')
            .setTitle('Configuração de Mensagem de Verificação!');

        const messageInputDescSay = new TextInputBuilder()
            .setCustomId('embedsay_desc')
            .setLabel('Coloque aqui a descrição da embed.')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Qual será a descrição? Estou ansioso para saber!');

        const row = new ActionRowBuilder().addComponents(messageInputDescSay);
        modalSay.addComponents(row);

        await interaction.showModal(modalSay);

        const filter = (i) => i.customId === 'modal_desc_say' && i.user.id === interaction.user.id;

        // Coletor pro modal
        interaction.awaitModalSubmit({ filter, time: 60000 })
            .then(async (modalInteraction) => {
                interaction.reply({ content: `❔ | Acho que me perdi...`})
                const messageContent = modalInteraction.fields.getTextInputValue('embedsay_desc');
                    db.set("prefixo", messageContent)
                    const info = await puxarInfo();
                    const { prefixo } = info;
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("configprefixo")
                                .setEmoji("1268839622671208490")
                                .setLabel("Configurar Prefixo")
                                .setStyle(ButtonStyle.Secondary)
                        )

                    const cor = await db.get(`color_embed`)
                    const embed = new EmbedBuilder()
                        .setDescription(`Olá, ${interaction.user} ! Seja bem vindo.\n * Oque deseja fazer?`)
                        .setTitle(`${interaction.guild.name} | Prefix! `)
                        .setColor(cor)
                        .addFields(
                            {
                                name:"Prefixo:",
                                value:`${prefixo}`,
                                inline: true
                            }

                    )

                    await interaction.followUp({ embeds: [embed], components: [row], ephemeral:true })





                })
            //

        }
        async function puxarInfo() {
            const prefixo = await db.get("prefixo")



            return {
                prefixo

            }
        }

    }
}
