const Discord = require("discord.js")

module.exports = {
  name: "ban",
  description: "Bane um usuário do servidor com a força do éter.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "usuario",
        description: "Selecione o usuário para banir.",
        type: Discord.ApplicationCommandOptionType.User,
        required: true,
    },
    {
        name: "motivo",
        description: "Motivo do banimento.",
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    }
  ],

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#FF4D4D")
            .setDescription(`❌ | ${interaction.user}, você precisa da permissão BANIR MEMBROS para usar este comando!`)
            .setFooter({ text: "AETHER • Moderação Cósmica" })
        ],
        ephemeral: true
      });
    }
    let userr = interaction.options.getUser("usuario");
    let user = interaction.guild.members.cache.get(userr.id);
    let motivo = interaction.options.getString("motivo") || "Não definido.";

    let embed = new Discord.EmbedBuilder()
      .setColor("#9D4EDD")
      .setDescription(`☁️ O usuário ${user} ([1m${user.id}[0m) foi banido com sucesso!\n\n🔹 Motivo: ${motivo}`)
      .setFooter({ text: "AETHER • Moderação Cósmica" });

    let erro = new Discord.EmbedBuilder()
      .setColor("#FF4D4D")
      .setDescription(`❌ | Não foi possível banir o usuário ${user} ([1m${user.id}[0m) do servidor!`)
      .setFooter({ text: "AETHER • Moderação Cósmica" });

    user.ban({ reason: motivo }).then(() => {
      interaction.reply({ embeds: [embed] });
    }).catch(e => {
      interaction.reply({ embeds: [erro], ephemeral: true });
    });
  }
}