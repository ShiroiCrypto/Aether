const client = require(`../../index.js`);
const Discord = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const corRoxa = parseInt('800080', 16);
const corRosa = parseInt('FF007F', 16);



module.exports = {
  name: "sugestão.js",
};

client.on('messageCreate', async message => {
    // Ignora mensagens de bots ou sem conteúdo
    if (message.author.bot || !message.content) return;

    const channelId = await db.get(`canalsugestao_${message.guild.id}`);
    if (!channelId) return;
    if (message.channel.id !== channelId) return;
    if (message.channel.type !== Discord.ChannelType.GuildText) return;

    try {
        await message.delete();
    } catch (error) {
        console.error('[Sugestão] Erro ao deletar mensagem:', error);
    }

    const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `Sugestão de: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`> \u200B\n\u200B${message.content}`)
        .setThumbnail(message.author.displayAvatarURL())
        .setColor(corRosa)
        .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL({ format: "png" }) });

    const row1 = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('aceitar_sugestao')
                .setLabel(`0`)
                .setStyle(2)
                .setEmoji('1168323257649348800'),
            new Discord.ButtonBuilder()
                .setCustomId('recusar_sugestao')
                .setLabel(`0`)
                .setStyle(2)
                .setEmoji('1168323587208380497'),
            new Discord.ButtonBuilder()
                .setCustomId('mostrar_votos')
                .setLabel('Mostrar Votos')
                .setStyle(1)
        );

    try {
        const sentMessage = await message.channel.send({ embeds: [embed], components: [row1] });
        await db.set(`suggest_${message.id}`, true);
        await sentMessage.startThread({
            name: `Sugestão Thread - ${message.author.username}`,
            autoArchiveDuration: 60
        });
    } catch (error) {
        console.error('[Sugestão] Erro ao enviar sugestão:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    const userId = interaction.user.id;

    if (interaction.customId === 'aceitar_sugestao' || interaction.customId === 'recusar_sugestao') {
        const r = await db.get(`${userId}_${interaction.message.id}`);
        const embed = new Discord.EmbedBuilder()
            .setDescription('Você já votou.')
            .setColor(corRoxa);
        if (r === 1) return await interaction.reply({ embeds: [embed], ephemeral: true });

        await db.set(`${userId}_${interaction.message.id}`, 1);

        let yesVotes = await db.get(`positivo_${interaction.message.id}`) || [];
        let noVotes = await db.get(`negativo_${interaction.message.id}`) || [];

        if (interaction.customId === 'aceitar_sugestao') {
            if (!yesVotes.includes(userId)) {
                yesVotes.push(userId);
                await db.set(`positivo_${interaction.message.id}`, yesVotes);
            }
        } else {
            if (!noVotes.includes(userId)) {
                noVotes.push(userId);
                await db.set(`negativo_${interaction.message.id}`, noVotes);
            }
        }

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('aceitar_sugestao')
                    .setLabel(`${yesVotes.length}`)
                    .setStyle(2)
                    .setEmoji('1168323257649348800'),
                new Discord.ButtonBuilder()
                    .setCustomId('recusar_sugestao')
                    .setLabel(`${noVotes.length}`)
                    .setStyle(2)
                    .setEmoji('1168323587208380497'),
                new Discord.ButtonBuilder()
                    .setCustomId('mostrar_votos')
                    .setLabel('Mostrar Votos')
                    .setStyle(1)
            );

        await interaction.update({ components: [row] });
    }

    if (interaction.customId === 'mostrar_votos') {
        const yesVotes = await db.get(`positivo_${interaction.message.id}`) || [];
        const noVotes = await db.get(`negativo_${interaction.message.id}`) || [];

        const yesUsernames = yesVotes.length > 0 ? yesVotes.map(userId => `<@${userId}>`).join('\n') : 'Sem votação';
        const noUsernames = noVotes.length > 0 ? noVotes.map(userId => `<@${userId}>`).join('\n') : 'Sem votação';

        const embed = new Discord.EmbedBuilder()
            .setColor(corRosa)
            .addFields(
                { name: 'Votação positiva', value: yesUsernames, inline: true },
                { name: 'Votação negativa', value: noUsernames, inline: true }
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});

/// Créditos: guss.dev