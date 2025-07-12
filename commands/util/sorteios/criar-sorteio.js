const Discord = require("discord.js");
const ms = require("ms");
const cores = require('../../colors.json');
const embeds = require('../../embed.json');

const COR_AETHER = cores.roxo_eter || "#9D4EDD";
const FOOTER_ICON = embeds.footer_icon || 'https://imgur.com/VrBHzHH.png';
const FOOTER_TEXT = 'AETHER • Sorteio Cósmico';
const SEPARADOR = '━━━ ⋆★⋆ ━━━';

module.exports = {
  name: "criarsorteio",
  description: "[🎉] Crie um sorteio cósmico no servidor.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "prêmio",
      type: Discord.ApplicationCommandOptionType.String,
      description: "Qual será o prêmio?",
      required: true,
    },
    {
      name: "descrição",
      type: Discord.ApplicationCommandOptionType.String,
      description: "Descreva o que será sorteado.",
      required: true,
    },
    {
        name: "chat",
        description: "Mencione um canal.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
      name: "tempo",
      type: Discord.ApplicationCommandOptionType.String,
      description: "Selecione o tempo do sorteio.",
      required: true,
      choices: [
        {
          name: "30 Segundos",
          value: "30s",
        },
        {
          name: "1 Minuto",
          value: "1m",
        },
        {
          name: "5 Minutos",
          value: "5m",
        },
        {
          name: "10 Minutos",
          value: "10m",
        },
        {
          name: "15 Minutos",
          value: "15m",
        },
        {
          name: "30 Minutos",
          value: "30m",
        },
        {
          name: "45 Minutos",
          value: "45m",
        },
        {
          name: "1 Hora",
          value: "1h",
        },
        {
          name: "2 Horas",
          value: "2h",
        },
        {
          name: "5 Horas",
          value: "5h",
        },
        {
          name: "12 Horas",
          value: "12h",
        },
        {
          name: "1 Dia",
          value: "24h",
        },
        {
          name: "3 dias",
          value: "72h",
        },
        {
          name: "1 Semana",
          value: "168h",
        },
      ],
    },
  ],

  run: async (client, interaction, args) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(cores.rosa_neon || '#FF6EC7')
            .setDescription('❌ | Você precisa da permissão **Gerenciar Servidor** para criar sorteios!')
            .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON })
        ],
        ephemeral: true
      });
    }
    let premio = interaction.options.getString("prêmio");
    let tempo = interaction.options.getString("tempo");
    let desc = interaction.options.getString("descrição");
    let chat = interaction.options.getChannel("chat");
    if (Discord.ChannelType.GuildText !== chat.type) return interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(cores.rosa_neon || '#FF6EC7')
          .setDescription('❌ | Este canal não é um canal de texto para enviar o sorteio.')
          .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON })
      ], ephemeral: true
    });

    let duracao = ms(tempo);
    let button = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("botao")
        .setEmoji("🎉")
        .setStyle(Discord.ButtonStyle.Secondary)
    );
    let click = [];

    let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: `🎉 Novo Sorteio Cósmico!`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setThumbnail(embeds.set_image || interaction.guild.iconURL({ dynamic: true }))
      .setDescription(
        `> 👤 **Criador:** ${interaction.user}\n> 🎁 **Prêmio:** ${premio}\n> 📝 **Descrição:** ${desc}\n> 👥 **Participantes:** ${click.length}\n> 🕒 **Tempo:** \`${tempo}\`\n${SEPARADOR}\n🔹 Powered by AETHER`
      )
      .setTimestamp(Date.now() + ms(tempo))
      .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON })
      .setColor(COR_AETHER);

    let erro = new Discord.EmbedBuilder()
      .setColor(cores.rosa_neon || '#FF6EC7')
      .setDescription(`❌ Não foi possível promover o sorteio!`)
      .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON });

    try {
      await chat.send({ embeds: [embed], components: [button] });
      await interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(COR_AETHER)
            .setDescription(`🌌 Sorteio cósmico iniciado em ${chat}! Clique em 🎉 para participar.`)
            .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON })
        ], ephemeral: true
      });
    } catch (e) {
      await interaction.reply({ embeds: [erro], ephemeral: true }).catch(() => {});
      return;
    }
    const msg = await chat.messages.fetch({ limit: 1 }).then(m => m.first());

    const coletor = msg.createMessageComponentCollector({
      time: duracao,
    });

    coletor.on("collect", (i) => {
      if (i.customId === "botao") {
        if (click.includes(i.user.id)) return i.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(COR_AETHER)
              .setDescription(`🔔 | ${i.user}, você já está participando do sorteio cósmico!`)
              .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON })
          ], ephemeral: true });
        click.push(i.user.id);
        let participanteEmbed = Discord.EmbedBuilder.from(embed).setDescription(
          `> 👤 **Criador:** ${interaction.user}\n> 🎁 **Prêmio:** ${premio}\n> 📝 **Descrição:** ${desc}\n> 👥 **Participantes:** ${click.length}\n> 🕒 **Tempo:** \`${tempo}\`\n${SEPARADOR}\n🔹 Powered by AETHER`
        );
        msg.edit({ embeds: [participanteEmbed] });
        i.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(cores.verde_neon || '#00FFB2')
              .setDescription(`✅ | ${i.user}, você entrou no sorteio cósmico!`)
              .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON })
          ], ephemeral: true });
      }
    });

    coletor.on("end", () => {
      msg.edit({ components: [
        new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setDisabled(true)
            .setCustomId("botao")
            .setEmoji("🎉")
            .setStyle(Discord.ButtonStyle.Secondary)
        )
      ] });
      let ganhador = click[Math.floor(Math.random() * click.length)];
      if (!ganhador) {
        chat.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(cores.rosa_neon || '#FF6EC7')
              .setDescription(`❌ **SORTEIO CANCELADO!**\nNão houveram participantes no sorteio \`${premio}\`.`)
              .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON })
          ]
        });
        return;
      }
      chat.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(cores.verde_neon || '#00FFB2')
            .setDescription(`🎉 **Parabéns <@${ganhador}>! Você ganhou o sorteio cósmico: \`${premio}\`.**`)
            .setFooter({ text: FOOTER_TEXT, iconURL: FOOTER_ICON })
        ]
      });
    });
  },
};
