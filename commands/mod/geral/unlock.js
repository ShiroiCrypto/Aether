const Discord = require("discord.js")

module.exports = {
  name: "unlock",
  description: "Desbloqueie um canal para mensagens com o toque do éter.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "Selecione o canal para desbloquear.",
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
      await canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true });
      const embed = new Discord.EmbedBuilder()
        .setColor("#00B4D8")
        .setDescription(`🔓 O canal ${canal} foi desbloqueado para mensagens!`)
        .setFooter({ text: "AETHER • Segurança Cósmica" });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      if (canal.id !== interaction.channel.id) {
        await canal.send({ embeds: [
          new Discord.EmbedBuilder()
            .setColor("#00B4D8")
            .setDescription(`🔓 Este canal foi desbloqueado para mensagens por ${interaction.user}.`)
            .setFooter({ text: "AETHER • Segurança Cósmica" })
        ] });
      }
    } catch (e) {
      await interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#FF4D4D")
            .setDescription(`❌ | Ops, algo deu errado ao tentar desbloquear o canal.\nMotivo: ${e.message || 'Erro desconhecido.'}`)
            .setFooter({ text: "AETHER • Segurança Cósmica" })
        ],
        ephemeral: true
      });
    }
  }
}