const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
  name: "slowmode",
  description: "Configure o modo lento em um canal de texto com o toque do éter.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "tempo",
      description: "Tempo do modo lento [s|m|h] (ex: 10s, 2m, 1h)",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "canal",
      description: "Selecione o canal de texto.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: false,
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
    let t = interaction.options.getString("tempo");
    let tempo = ms(t);
    let channel = interaction.options.getChannel("canal") || interaction.channel;
    if (!channel.isTextBased()) {
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
    if (!tempo || tempo < 1000 || tempo > 21600000) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#FF6EC7")
            .setDescription(`☁️ Forneça um tempo válido entre 1s e 6h. Exemplo: /slowmode tempo:10s`)
            .setFooter({ text: "AETHER • Moderação Cósmica" })
        ],
        ephemeral: true
      });
    }
    try {
      await channel.setRateLimitPerUser(tempo / 1000);
      await interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#9D4EDD")
            .setDescription(`☁️ O canal ${channel} agora está em modo lento: [1m${t}[0m.`)
            .setFooter({ text: "AETHER • Moderação Cósmica" })
        ],
        ephemeral: true
      });
    } catch (e) {
      await interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#FF4D4D")
            .setDescription(`❌ | Ops, algo deu errado ao definir o modo lento.\nMotivo: ${e.message || 'Erro desconhecido.'}`)
            .setFooter({ text: "AETHER • Moderação Cósmica" })
        ],
        ephemeral: true
      });
    }
  }
}