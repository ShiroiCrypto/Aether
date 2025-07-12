const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB();

module.exports = {
  name: "set-antilink",
  description: "Ative ou desative o sistema de antilink no servidor.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#FF4D4D")
            .setDescription(`❌ | ${interaction.user}, você precisa da permissão ADMINISTRADOR para usar este comando!`)
            .setFooter({ text: "AETHER • Moderação Cósmica" })
        ],
        ephemeral: true
      });
    }

    let embed_g = new Discord.EmbedBuilder()
      .setColor("#9D4EDD")
      .setDescription(`☁️ ${interaction.user}, o sistema de antilink foi **ativado**!\n\n🔹 Powered by AETHER`)
      .setFooter({ text: "AETHER • Segurança Cósmica" });

    let embed_r = new Discord.EmbedBuilder()
      .setColor("#00B4D8")
      .setDescription(`☁️ ${interaction.user}, o sistema de antilink foi **desativado**.`)
      .setFooter({ text: "AETHER • Segurança Cósmica" });

    let confirm = await db.get(`antilink_${interaction.guild.id}`);

    if (confirm === null || confirm === false) {
      await interaction.reply({ embeds: [embed_g] });
      await db.set(`antilink_${interaction.guild.id}`, true);
    } else if (confirm === true) {
      await interaction.reply({ embeds: [embed_r] });
      await db.set(`antilink_${interaction.guild.id}`, false);
    }
  }
}