const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { db , owner , tk } = require("../../database/index");


module.exports = {
    name:"painel",
    description:"[🤖] painel de controle do bot",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {
        const cor = await db.get(`color_embed`)
        if(owner !== interaction.user.id) return interaction.reply({content:`> Você não tem permissão de usar este comando.`, ephemeral: true });
        const system = await db.get("system");
      // invite - bot link
                    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8`;
        interaction.reply({
             

            embeds: [
                new EmbedBuilder()
                .setAuthor({name: "Painel de Controle", iconURL: client.user.avatarURL()})
                .setDescription(`Bom dia, **${interaction.member.displayName}**! Aqui você pode controlar o bot.`)
                .addFields(
                    {
                        name:"Status:",
                        value:`${system ? "`Ligado`" : "`Desligado`"}`,
                        inline: true
                    },
                    {
                        name:"Versão:",
                        value:`\`1.0.0\``,
                        inline: true
                    },
                    {
                        name:"Ping:",
                        value:`\`${client.ws.ping}ms\``,
                        inline: true
                    },
                )
                .setColor(cor)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
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
                    .setEmoji("1241248275521208320"),
                  ),
                  new ActionRowBuilder()
                  .addComponents(

                  new ButtonBuilder()
                  .setLabel(`Adicionar BOT`)
                  .setEmoji(`🤖`)
                  .setStyle(`Link`)
                  .setURL(inviteLink)
                  )
                
            ],
            ephemeral: true
        });
    }
}