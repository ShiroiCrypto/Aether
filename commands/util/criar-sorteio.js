const Discord = require("discord.js");
const ms = require("ms");
const cores = require('../../colors.json');
const embeds = require('../../embed.json');

module.exports = {
  name: "criarsorteio",
  description: "[🎉] Crie um sorteio no servidor.",
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
      interaction.reply({ content: `<:1132317002602647583:1233103895316660354> Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
      let premio = interaction.options.getString("prêmio");
      let tempo = interaction.options.getString("tempo");
      let desc = interaction.options.getString("descrição");
      let chat = interaction.options.getChannel("chat")
      if (Discord.ChannelType.GuildText !== chat.type) return interaction.reply(`<:1132317002602647583:1233103895316660354> Este canal não é um canal de texto para enviar uma mensagem.`)

      let duracao = ms(tempo);

      let button = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("botao")
          .setEmoji("🎉")
          .setStyle(Discord.ButtonStyle.Secondary)
      );

      let click = [];

      let embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `Novo sorteio!`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`> - 👤 **CRIADOR:** ${interaction.user}.
         > - 🎁 **PRÊMIO:** ${premio}.
         > - ➡️ **DESCRIÇÃO:** ${desc}
         > - 👥 **PARTICIPANTES:** ${click.length}
         > - 🕒 **TEMPO:** \`${tempo}\`.`)
        .setTimestamp(Date.now() + ms(tempo))
        .setFooter({ text: "DATA DO SORTEIO:", iconURL: embeds.footer_icon })
        .setColor("#8874ff");

      let erro = new Discord.EmbedBuilder()
        .setColor("#8874ff")
        .setDescription(`❌ Não foi possível promover o sorteio!`);

      try {
        await interaction.reply({ embeds: [embed], components: [button] });
      } catch (e) {
        await interaction.reply({ embeds: [erro], ephemeral: true }).catch(() => {});
        return;
      }
      const msg = await interaction.fetchReply();

      const coletor = msg.createMessageComponentCollector({
        time: ms(tempo),
      });

      coletor.on("end", (i) => {
        interaction.editReply({ components: [
            new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                  .setDisabled(true)
                  .setCustomId("botao")
                  .setEmoji("🎉")
                  .setStyle(Discord.ButtonStyle.Secondary)
              )
          ] });
      });

      coletor.on("collect", (i) => {

        if (i.customId === "botao") {

          if (click.includes(i.user.id)) return i.reply({ content: `Olá ${i.user}, você ja está participando do sorteio.`, ephemeral: true });

          click.push(i.user.id);

          const participanteEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: `Novo sorteio!`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`> - 👤 **CRIADOR:** ${interaction.user}.
           > - 🎁 **PRÊMIO:** ${premio}.
           > - ➡️ **DESCRIÇÃO:** ${desc}
           > - 👥 **PARTICIPANTES:** ${click.length}
           > - 🕒 **TEMPO:** \`${tempo}\`.`)
          .setTimestamp(Date.now() + ms(tempo))
          .setFooter({ text: "DATA DO SORTEIO:", iconURL: embeds.footer_icon })
          .setColor("#8874ff");
  
          interaction.editReply({ embeds: [participanteEmbed] });

          i.reply({ content: `✅ Olá ${i.user}, você entrou no sorteio.`, ephemeral: true });
        }

      });

      setTimeout(() => {
        let ganhador = click[Math.floor(Math.random() * click.length)];

        if (click.length == 0) return interaction.followUp(`❌ **SORTEIO CANCELADO!**\nNão houveram participantes no sorteio \`${premio}\`.`);

        interaction.followUp(`🎉 **Parabéns <@${ganhador}> você ganhou o sorteio: \`${premio}\`.**`);

      }, duracao);
    }
  },
};
