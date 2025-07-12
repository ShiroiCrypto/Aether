const Discord = require("discord.js")

module.exports = {
  name: "kick", // Coloque o nome do comando
  description: "Expulse um membro do servidor.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "membro",
        description: "Mencione um membro.",
        type: Discord.ApplicationCommandOptionType.User,
        required: true,
    },
    {
        name: "motivo",
        description: "Descreva o motivo da expulsão.",
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)) {
        return interaction.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor("#FF4D4D")
              .setDescription(`❌ | ${interaction.user}, você precisa da permissão EXPULSAR MEMBROS para usar este comando!`)
              .setFooter({ text: "AETHER • Moderação Cósmica" })
          ],
          ephemeral: true
        });
    }
    const user = interaction.options.getUser("membro");
    const membro = interaction.guild.members.cache.get(user.id);
    let motivo = interaction.options.getString("motivo") || "Não informado";

    let embed = new Discord.EmbedBuilder()
      .setColor("#9D4EDD")
      .setDescription(`☁️ O usuário ${membro} foi expulso com sucesso!\n\n🔹 Motivo: ${motivo}`)
      .setFooter({ text: "AETHER • Moderação Cósmica" });

    let embed_erro = new Discord.EmbedBuilder()
      .setColor("#FF4D4D")
      .setDescription(`❌ | O usuário ${membro} não foi expulso do servidor!\nHouve um erro na execução, tente novamente.`)
      .setFooter({ text: "AETHER • Moderação Cósmica" });

    membro.kick(motivo).then(() => {
      interaction.reply({ embeds: [embed] });
    }).catch(e => {
      interaction.reply({ embeds: [embed_erro], ephemeral: true });
    })
    }


  }