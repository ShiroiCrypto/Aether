// comandos/registrar_venda.js  (discord.js v14)
const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
  } = require('discord.js');
  
  const HEX_PADRAO   = '#8874ff';                       // cor padrão
  const SEPARADOR    = '━━━ ⋆★⋆ ━━━';                  // frufru visual
  
  // ——— IMAGENS FIXAS ———
  const THUMBNAIL_URL = 'https://imgur.com/VrBHzHH.png'; // miniatura fixa
  const BANNER_URL    = 'https://imgur.com/Qx3RM4W.png'; // banner fixo (troque à vontade)
  
  module.exports = {
    name: 'registrar_venda',
    description: 'Registra uma venda manualmente e anuncia no canal.',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'chat',
        description: 'Canal onde o anúncio será postado',
        type: ApplicationCommandOptionType.Channel,
        required: true,
        channel_types: [ChannelType.GuildText],
      },
      {
        name: 'comprador',
        description: 'Usuário que realizou a compra',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  
    /** @param {import('discord.js').ChatInputCommandInteraction} interaction */
    async run(client, interaction) {
      // 1) permissão
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.reply({
          content: '❌ Você precisa da permissão **Gerenciar Servidor**.',
          ephemeral: true,
        });
      }
  
      // 2) modal
      const modal = new ModalBuilder()
        .setCustomId('vendaModal')
        .setTitle('Registrar venda');
  
      const campoProduto = new TextInputBuilder()
        .setCustomId('produto')
        .setLabel('Produto / Serviço')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Nome do item vendido')
        .setRequired(true);
  
      const campoValor = new TextInputBuilder()
        .setCustomId('valor')
        .setLabel('Valor (opcional)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Ex.: R$ 99,90')
        .setRequired(false);
  
      const campoCor = new TextInputBuilder()
        .setCustomId('cor')
        .setLabel('Cor HEX (opcional)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('#8874ff, #00ff00…')
        .setRequired(false);
  
      modal.addComponents(
        new ActionRowBuilder().addComponents(campoProduto),
        new ActionRowBuilder().addComponents(campoValor),
        new ActionRowBuilder().addComponents(campoCor),
      );
  
      await interaction.showModal(modal);
  
      // 3) aguardando resposta
      const envio = await interaction.awaitModalSubmit({
        filter: i => i.customId === 'vendaModal' && i.user.id === interaction.user.id,
        time: 5 * 60 * 1000,
      }).catch(() => null);
  
      if (!envio) return; // expirou
  
      // 4) dados
      const produto   = envio.fields.getTextInputValue('produto');
      const valor     = envio.fields.getTextInputValue('valor')?.trim();
      let   corInput  = envio.fields.getTextInputValue('cor')?.trim();
  
      const canalAlvo = interaction.options.getChannel('chat');
      const comprador = interaction.options.getUser('comprador');
  
      // cor válida?
      if (!/^#?([0-9A-F]{6})$/i.test(corInput || '')) corInput = HEX_PADRAO;
      if (!corInput.startsWith('#')) corInput = `#${corInput}`;
  
      // 5) embed
      const embed = new EmbedBuilder()
        .setTitle('🛒 Venda efetuada!')
        .setDescription(
          `**Produto:** ${produto}\n` +
          (valor ? `**Valor:** ${valor}\n` : '') +
          `**Comprador:** ${comprador}\n\n` +
          `— *Equipe ${interaction.guild.name}*`
        )
        .setColor(corInput)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ size: 128 }),
        })
        .setThumbnail(THUMBNAIL_URL)   // sempre a mesma
        .setImage(BANNER_URL)          // sempre a mesma
        .setFooter({
          text: `Registrado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp()
        .addFields({ name: '\u200B', value: SEPARADOR });
  
      // 6) enviar
      await canalAlvo.send({ content: `${comprador}`, embeds: [embed] });
      await envio.reply({
        content: `✅ Venda registrada e anunciada em ${canalAlvo}.`,
        ephemeral: true,
      });
    },
  };
  