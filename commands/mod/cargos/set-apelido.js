const Discord = require("discord.js")

module.exports = {
  name: "set-apelido",
  description: "Altere o nickname de um membro com o toque cósmico do Aether.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "membro",
        description: "Selecione o membro para alterar o apelido.",
        type: Discord.ApplicationCommandOptionType.User,
        required: true,
    },
    {
        name: "nick",
        description: "Novo apelido para o membro.",
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
    }
  ],

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageNicknames)) {
        return interaction.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor("#FF4D4D")
              .setDescription(`❌ | ${interaction.user}, você precisa da permissão [1mGERENCIAR APELIDOS[0m para usar este comando!`)
              .setFooter({ text: "AETHER • Moderação Cósmica" })
          ],
          ephemeral: true
        });
    }
    const user = interaction.options.getUser("membro");
    const membro = interaction.guild.members.cache.get(user.id);
    const nick = interaction.options.getString("nick");

    membro.setNickname(`${nick}`).then(() => {
      let embed = new Discord.EmbedBuilder()
        .setColor("#9D4EDD")
        .setDescription(`☁️ ${user} agora respira um novo nome: \[1m${nick}[0m!`)
        .setFooter({ text: "AETHER • O elemento que mantém seu servidor vivo" });
      interaction.reply({ embeds: [embed] });
    }).catch(e => {
      let embed = new Discord.EmbedBuilder()
        .setColor("#FF4D4D")
        .setDescription(`❌ | O apelido excede 32 caracteres ou ocorreu um erro.`)
        .setFooter({ text: "AETHER • Moderação Cósmica" });
      interaction.reply({ embeds: [embed], ephemeral: true });
    });
  }
}