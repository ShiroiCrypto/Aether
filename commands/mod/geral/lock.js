const Discord = require("discord.js")

module.exports = {
  name: "lock",
  description: "Bloqueie um canal para mensagens com o poder do éter.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "Selecione o canal para bloquear.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    }
  ],

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#FF4D4D")
            .setDescription(`❌ | ${interaction.user}, você precisa da permissão GERENCIAR CANAIS para usar este comando!`)
            .setFooter({ text: "AETHER • Moderação Cósmica" })
        ],
        ephemeral: true
      });
    }
    const canal = interaction.options.getChannel("canal");
    if (!canal.isTextBased()) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#FF4D4D")
            .setDescription(`❌ | O canal selecionado não é de texto.`)
            .setFooter({ text: "AETHER • Moderação Cósmica" })
        ],
        ephemeral: true
      });
    }
    try {
      await canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });
      const embed = new Discord.EmbedBuilder()
        .setColor("#9D4EDD")
        .setDescription(`🔒 O canal ${canal} foi bloqueado para mensagens!`)
        .setFooter({ text: "AETHER • Segurança Cósmica" });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      if (canal.id !== interaction.channel.id) {
        await canal.send({ embeds: [
          new Discord.EmbedBuilder()
            .setColor("#9D4EDD")
            .setDescription(`🔒 Este canal foi bloqueado para mensagens por ${interaction.user}.`)
            .setFooter({ text: "AETHER • Segurança Cósmica" })
        ] });
      }
    } catch (e) {
      await interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#FF4D4D")
            .setDescription(`❌ | Ops, algo deu errado ao tentar bloquear o canal.\nMotivo: ${e.message || 'Erro desconhecido.'}`)
            .setFooter({ text: "AETHER • Segurança Cósmica" })
        ],
        ephemeral: true
      });
    }
  }
}