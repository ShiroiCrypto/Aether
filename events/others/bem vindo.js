// listeners/guildMemberAdd.js
const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const client = require('../../index.js');          // seu client principal
const { db } = require('../../database/index');    // seu wrapper de DB (quick.db, etc.)

/* ===== CONFIGURAÇÕES RÁPIDAS ===== */
const CONFIG = {
  canalBoasVindas: '1385467532798070916',  // Mensagem de boas‑vindas
  canalAvisos:     '1345404652845268992',  // Avisos importantes
  canalLoja:       '1290394864139108372',  // Lojinha
  canalTickets:    '1290391105971425383',  // Tickets
  corPadrao:       '#f17ea1',              // Se não houver cor salva no DB
  bannerUrl:       'https://i.imgur.com/e2SR7Z6.png',
};

/* ===== LISTENER ===== */
client.on('guildMemberAdd', async (member) => {
  try {
    /* 1. Garante que o canal exista e seja texto */
    let canal = member.guild.channels.cache.get(CONFIG.canalBoasVindas);
    if (!canal) {
      // Não estava no cache → faz fetch
      const fetched = await member.guild.channels.fetch(CONFIG.canalBoasVindas).catch(() => null);
      if (fetched && fetched.type === ChannelType.GuildText) canal = fetched;
    }
    if (!canal) return;

    /* 2. Verifica permissão de envio */
    const perms = canal.permissionsFor(member.guild.members.me);
    if (!perms?.has(PermissionsBitField.Flags.SendMessages)) return;

    /* 3. Dados dinâmicos */
    const corEmbed  = (await db.get('color_embed')) || CONFIG.corPadrao;
    const nomeSrv   = member.guild.name || 'nosso servidor';
    const membros   = member.guild.memberCount.toLocaleString('pt-BR');
    const guildIcon = member.guild.iconURL({ dynamic: true });

    /* 4. Cria Embed */
    const embed = new EmbedBuilder()
      .setColor(corEmbed)
      .setTitle('☁️ — BEM-VINDO(A) AO ' + nomeSrv.toUpperCase())
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage(CONFIG.bannerUrl)
      .setDescription(
`✨ ${member}, você agora respira o ar dos deuses.\n\n🚀 Confira <#${CONFIG.canalAvisos}> e pegue seus cargos em <#${CONFIG.canalLoja}>.\n\n☁️ AETHER vai te guiar por aqui!\n\n> Já somos **${membros} membros**!\n\nPrecisa de ajuda? Chame a equipe. Aproveite sua estadia!`
      )
      .setFooter({ text: `AETHER • ID: ${member.id}`, iconURL: guildIcon })
      .setTimestamp();

    /* 5. Envia mensagem */
    await canal.send({
      content: `👋 Olá ${member}!`,
      embeds: [embed],
    });

  } catch (err) {
    console.error('[Boas-vindas] Falhou:', err);
  }
});
