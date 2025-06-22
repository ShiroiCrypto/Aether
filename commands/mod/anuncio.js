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
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

const HEX_PADRAO = '#8874ff';
const SEPARADOR = '━━━ ⋆★⋆ ━━━';
const FIXED_THUMBNAIL = 'https://imgur.com/VrBHzHH.png';

module.exports = {
  name: 'anunciar',
  description: 'Cria um anúncio estilizado com preview antes de enviar.',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'chat',
      description: 'Canal onde o anúncio será postado',
      type: ApplicationCommandOptionType.Channel,
      required: true,
      channel_types: [ChannelType.GuildText],
    },
  ],

  /** @param {import('discord.js').ChatInputCommandInteraction} interaction */
  async run(client, interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({
        content: '❌ Você precisa da permissão **Gerenciar Servidor**.',
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId('anuncioModal')
      .setTitle('Novo anúncio');

    const campos = [
      {
        id: 'titulo',
        label: 'Título',
        style: TextInputStyle.Short,
        placeholder: 'Algo chamativo…',
        required: true,
      },
      {
        id: 'descricao',
        label: 'Descrição',
        style: TextInputStyle.Paragraph,
        placeholder: 'Detalhes do anúncio',
        required: true,
      },
      {
        id: 'cor',
        label: 'Cor HEX (opcional)',
        style: TextInputStyle.Short,
        placeholder: '#8874ff, #00ff00…',
        required: false,
      },
      {
        id: 'img_url_1',
        label: 'URL da IMAGEM 1 (opcional)',
        style: TextInputStyle.Short,
        placeholder: 'https://exemplo.com/img1.png',
        required: false,
      },
      {
        id: 'img_url_2',
        label: 'URL da IMAGEM 2 (opcional)',
        style: TextInputStyle.Short,
        placeholder: 'https://exemplo.com/img2.png',
        required: false,
      },
    ];

    modal.addComponents(
      ...campos.map(
        (c) =>
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId(c.id)
              .setLabel(c.label)
              .setStyle(c.style)
              .setPlaceholder(c.placeholder)
              .setRequired(c.required)
          )
      )
    );

    await interaction.showModal(modal);

    const envio = await interaction
      .awaitModalSubmit({
        filter: (i) =>
          i.customId === 'anuncioModal' && i.user.id === interaction.user.id,
        time: 5 * 60 * 1000,
      })
      .catch(() => null);

    if (!envio) return;

    const titulo = envio.fields.getTextInputValue('titulo');
    const descricao = envio.fields.getTextInputValue('descricao');
    let corInput = envio.fields.getTextInputValue('cor')?.trim();
    const img1URL = envio.fields.getTextInputValue('img_url_1')?.trim();
    const img2URL = envio.fields.getTextInputValue('img_url_2')?.trim();
    const canalAlvo = interaction.options.getChannel('chat');

    if (!/^#?([0-9A-F]{6})$/i.test(corInput || '')) corInput = HEX_PADRAO;
    if (!corInput.startsWith('#')) corInput = `#${corInput}`;

    // 🔥 Prefixos inteligentes
    const parseTexto = (texto) =>
      texto
        .replace(/{user}/gi, `<@${interaction.user.id}>`)
        .replace(/{todos}/gi, '@everyone')
        .replace(/{here}/gi, '@here')
        .replace(/{server}/gi, interaction.guild.name)
        .replace(/{canal}/gi, `<#${canalAlvo.id}>`);

    const embed = new EmbedBuilder()
      .setTitle(`✨ ${parseTexto(titulo)}`)
      .setDescription(`${parseTexto(descricao)}\n\n— *Equipe ${interaction.guild.name}*`)
      .setColor(corInput)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ size: 128 }),
      })
      .setThumbnail(FIXED_THUMBNAIL)
      .setFooter({
        text: `Enviado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp()
      .addFields({ name: '\u200B', value: SEPARADOR });

    // 🔘 Botões de confirmação
    const botoes = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confirmarEnvio')
        .setLabel('✔️ Confirmar')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('cancelarEnvio')
        .setLabel('❌ Cancelar')
        .setStyle(ButtonStyle.Danger)
    );

    // 🔍 Preview
    await envio.reply({
      content: `🔍 **Veja como seu anúncio ficará em ${canalAlvo}:**\nConfirme para enviar ou cancele.`,
      embeds: [embed],
      components: [botoes],
      ephemeral: true,
    });

    const collector = envio.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 5 * 60 * 1000,
      filter: (i) => i.user.id === interaction.user.id,
    });

    collector.on('collect', async (i) => {
      if (i.customId === 'confirmarEnvio') {
        await canalAlvo.send({ embeds: [embed] });
        if (img1URL) await canalAlvo.send({ content: img1URL });
        if (img2URL) await canalAlvo.send({ content: img2URL });

        await i.update({
          content: `✅ Anúncio enviado com sucesso em ${canalAlvo}.`,
          embeds: [],
          components: [],
        });

        collector.stop();
      } else if (i.customId === 'cancelarEnvio') {
        await i.update({
          content: '❌ Envio do anúncio cancelado.',
          embeds: [],
          components: [],
        });

        collector.stop();
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        await envio.editReply({
          content: '⏳ Tempo esgotado. O anúncio não foi enviado.',
          embeds: [],
          components: [],
        });
      }
    });
  },
};
