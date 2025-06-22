const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "setverificar", // Coloque o nome do comando
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
        return interaction.reply({ content: `Olá ${interaction.user}, você não possui permissão para utilizar este comando.`, ephemeral: true });
    }
    let canal = interaction.options.getChannel("canal") || interaction.channel;
    let cargo = interaction.options.getRole("cargo_verificado");
    let mensagem = interaction.options.getString("mensagem") || `> Clique no botão abaixo para se verificar no servidor.`;
    let emoji = interaction.options.getString("emoji") || "✅";
    let cor = interaction.options.getString("cor") || "Green";
    let log = interaction.options.getChannel("log");

    if (!canal.isTextBased()) {
      return interaction.reply({ content: `O canal informado não é de texto.`, ephemeral: true });
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