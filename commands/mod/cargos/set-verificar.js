const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "set-verificar", // Coloque o nome do comando
  description: "Ative o sistema de verificação.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "cargo_verificado",
        description: "Mencione um cargo para o membro receber após se verificar.",
        type: Discord.ApplicationCommandOptionType.Role,
        required: true,
    },
    {
        name: "canal",
        description: "Mencione um canal de texto.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: false,
    },
    {
        name: "mensagem",
        description: "Mensagem personalizada de verificação.",
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: "emoji",
        description: "Emoji do botão.",
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: "cor",
        description: "Cor do embed de verificação (hex ou nome).",
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    },
    {
        name: "log",
        description: "Canal de logs para registrar verificações.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: false,
    }
],

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
        return interaction.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor("#FF4D4D")
              .setDescription(`❌ | ${interaction.user}, você precisa da permissão GERENCIAR SERVIDOR para usar este comando!`)
              .setFooter({ text: "AETHER • Moderação Cósmica" })
          ],
          ephemeral: true
        });
    }
    let canal = interaction.options.getChannel("canal") || interaction.channel;
    let cargo = interaction.options.getRole("cargo_verificado");
    let mensagem = interaction.options.getString("mensagem") || `☁️ Clique no botão abaixo para se verificar no servidor e respirar o ar dos deuses!`;
    let emoji = interaction.options.getString("emoji") || "☁️";
    let cor = interaction.options.getString("cor") || "#9D4EDD";
    let log = interaction.options.getChannel("log");

    if (!canal.isTextBased()) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#FF4D4D")
            .setDescription(`❌ | O canal informado não é de texto.`)
            .setFooter({ text: "AETHER • Moderação Cósmica" })
        ],
        ephemeral: true
      });
    }
    if (!cargo) {
      return interaction.reply({ content: `Cargo inválido.`, ephemeral: true });
    }
    await db.set(`cargo_verificação_${interaction.guild.id}`, cargo.id);
    await db.set(`verificacao_config_${interaction.guild.id}`, { mensagem, emoji, cor, log: log ? log.id : null });

    let embed_ephemeral = new Discord.EmbedBuilder()
      .setColor("Grey")
      .setDescription(`Olá ${interaction.user}, o sistema foi ativado no canal ${canal} com sucesso.`);

    let embed_verificacao = new Discord.EmbedBuilder()
      .setColor(cor)
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setDescription(mensagem);

    let botao = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("verificar")
        .setEmoji(emoji)
        .setLabel("Verifique-se")
        .setStyle(Discord.ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed_ephemeral], ephemeral: true });
    await canal.send({ embeds: [embed_verificacao], components: [botao] });
  }
}