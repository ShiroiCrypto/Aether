const client = require(`../../index.js`);
const { QuickDB } = require("quick.db");
const db = new QuickDB();

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "verificar") {
        let role_id = await db.get(`cargo_verificação_${interaction.guild.id}`);
        let config = await db.get(`verificacao_config_${interaction.guild.id}`) || {};
        let role = interaction.guild.roles.cache.get(role_id);
        if (!role) return interaction.reply({ content: `Cargo de verificação não encontrado. Avise um administrador.`, ephemeral: true });
        if (interaction.member.roles.cache.has(role.id)) {
          return interaction.reply({ content: `Você já está verificado!`, ephemeral: true });
        }
        // Tenta adicionar o cargo
        try {
          await interaction.member.roles.add(role.id);
        } catch (e) {
          return interaction.reply({ content: `Não consegui atribuir o cargo. Verifique minhas permissões.`, ephemeral: true });
        }
        await interaction.reply({ content: `Olá **${interaction.user.username}**, você foi verificado!`, ephemeral: true });
        // Loga a verificação se configurado
        if (config.log) {
          let logChannel = interaction.guild.channels.cache.get(config.log);
          if (logChannel && logChannel.isTextBased()) {
            logChannel.send({ content: `✅ ${interaction.user} foi verificado no servidor.` });
          }
        }
      }
    }
  })