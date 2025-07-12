const Discord = require("discord.js")

module.exports = {
  name: "unban",
  description: "Desbane um usuário do servidor com o toque do éter.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Selecione o usuário para desbanir.",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "motivo",
      description: "Motivo do desbanimento.",
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
    let user = interaction.options.getUser("user");
    let motivo = interaction.options.getString("motivo") || "Não definido.";
    try {
      await interaction.guild.members.unban(user.id, motivo);
      let embed = new Discord.EmbedBuilder()
        .setColor("#9D4EDD")
        .setDescription(`☁️ O usuário ${user} ([1m${user.id}[0m) foi desbanido com sucesso!\n\n🔹 Motivo: ${motivo}`)
        .setFooter({ text: "AETHER • Moderação Cósmica" });
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      let erro = new Discord.EmbedBuilder()
        .setColor("#FF4D4D")
        .setDescription(`❌ | Não foi possível desbanir o usuário ${user} ([1m${user.id}[0m) do servidor!\nMotivo: ${e.message || 'Erro desconhecido.'}`)
        .setFooter({ text: "AETHER • Moderação Cósmica" });
      await interaction.reply({ embeds: [erro], ephemeral: true });
    }
  }
}