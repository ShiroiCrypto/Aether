const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "delet-sugestao",
    description: "Remove o canal de sugestões do servidor.",
    type: 1,
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has('ManageChannels')) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF4D4D")
                        .setDescription(`❌ | ${interaction.user}, você precisa da permissão GERENCIAR CANAIS para usar este comando!`)
                        .setFooter({ text: "AETHER • Sugestões Cósmicas" })
                ],
                ephemeral: true
            });
        }
        try {
            await db.delete(`canalsugestao_${interaction.guild.id}`);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#9D4EDD")
                        .setDescription(`☁️ Canal de sugestões removido com sucesso!`)
                        .setFooter({ text: "AETHER • Sugestões Cósmicas" })
                ],
                ephemeral: true
            });
        } catch (e) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF4D4D")
                        .setDescription(`❌ | Ocorreu um erro ao remover o canal de sugestões.\nMotivo: ${e.message || 'Erro desconhecido.'}`)
                        .setFooter({ text: "AETHER • Sugestões Cósmicas" })
                ],
                ephemeral: true
            });
        }
    }
}