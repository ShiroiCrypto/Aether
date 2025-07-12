const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { db, owner } = require("../../database/index");


module.exports = {
    name: "painel",
    description: "[☁️] Painel de controle cósmico do Aether",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const cor = (await db.get(`color_embed`)) || "#9D4EDD";
        if (owner !== interaction.user.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF4D4D")
                        .setDescription(`❌ | ${interaction.user}, apenas o proprietário pode acessar o painel!`)
                        .setFooter({ text: "AETHER • Painel Cósmico" })
                ],
                ephemeral: true
            });
        }
        const system = await db.get("system");
      // invite - bot link
                    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8`;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "☁️ Painel de Controle Aether", iconURL: client.user.avatarURL() })
                    .setDescription(`🌌 Olá, **${interaction.member.displayName}**! Bem-vindo ao painel de controle do Aether.`)
                    .addFields(
                        { name: "Status:", value: `${system ? "`Ligado`" : "`Desligado`"}`, inline: true },
                        { name: "Versão:", value: "`1.0.0`", inline: true },
                        { name: "Ping:", value: `[1m${client.ws.ping}ms[0m`, inline: true }
                    )
                    .setColor(cor)
                    .setFooter({ text: "AETHER • Painel Cósmico" })
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("systemtrueorfalse")
                        .setEmoji(system ? "1213989846213984267" : "1213989844548849667")
                        .setStyle(system ? 3 : 4),
                    new ButtonBuilder()
                        .setCustomId("configpanel")
                        .setLabel("Configurar Painel")
                        .setStyle(1)
                        .setEmoji("1218985928652099594"),
                    new ButtonBuilder()
                        .setCustomId("definition")
                        .setLabel("Definições")
                        .setStyle(2)
                        .setEmoji("1241248275521208320")
                ),
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel(`Adicionar BOT`)
                        .setEmoji(`🤖`)
                        .setStyle(ButtonBuilder.Style.Link || 5)
                        .setURL(inviteLink)
                )
            ]
        });
    }
}