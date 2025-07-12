const { EmbedBuilder } = require('discord.js');
const colors = require('../colors.json');
const embedTemplate = require('../embed.json');

/**
 * Cria um EmbedBuilder padronizado com a identidade visual Aether.
 * @param {Object} options - Opções para customizar o embed.
 * @param {string} [options.title] - Título do embed.
 * @param {string} [options.description] - Descrição do embed.
 * @param {string} [options.color] - Cor do embed (hex ou nome da paleta).
 * @param {string} [options.thumbnail] - URL da thumbnail.
 * @param {string} [options.image] - URL da imagem principal.
 * @param {string} [options.footer] - Texto do rodapé.
 * @param {string} [options.footerIcon] - Ícone do rodapé.
 * @param {Object[]} [options.fields] - Campos adicionais.
 * @param {string} [options.author] - Nome do autor.
 * @param {string} [options.authorIcon] - Ícone do autor.
 * @returns {EmbedBuilder}
 */
function getAetherEmbed(options = {}) {
  const embed = new EmbedBuilder();

  // Cor
  let color = options.color || embedTemplate.embed_padrao.color || colors.roxo_eter;
  if (colors[color]) color = colors[color];
  embed.setColor(color);

  // Título
  embed.setTitle(options.title || embedTemplate.embed_padrao.title);

  // Descrição
  embed.setDescription(options.description || embedTemplate.embed_padrao.description);

  // Thumbnail
  if (options.thumbnail || embedTemplate.image_thumb) {
    embed.setThumbnail(options.thumbnail || embedTemplate.image_thumb);
  }

  // Imagem principal
  if (options.image || embedTemplate.set_image) {
    embed.setImage(options.image || embedTemplate.set_image);
  }

  // Footer
  embed.setFooter({
    text: options.footer || embedTemplate.footer_text || 'Powered by AETHER',
    iconURL: options.footerIcon || embedTemplate.footer_icon || undefined,
  });

  // Author
  if (options.author || embedTemplate.author_name) {
    embed.setAuthor({
      name: options.author || embedTemplate.author_name,
      iconURL: options.authorIcon || embedTemplate.author_icon || undefined,
    });
  }

  // Campos adicionais
  if (options.fields && Array.isArray(options.fields)) {
    embed.addFields(...options.fields);
  }

  embed.setTimestamp();
  return embed;
}

module.exports = { getAetherEmbed }; 