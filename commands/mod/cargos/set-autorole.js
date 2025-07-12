const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Discord = require("discord.js");

module.exports = {
    name: "set-autorole",
    description: "Configure o sistema de autorole.",
    options: [
        {
            name: "cargo",
            description: "Selecione um cargo para o autorole",
            type: Discord.ApplicationCommandOptionType.Role,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            return await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`:x: **| ${interaction.user.tag},** Você precisa da permissão \`MANAGE_GUILD\` para usar este comando!`)
                        .setColor("Red"),
                ],
                ephemeral: true,
            });
        }

        const role = interaction.options.getRole("cargo");
        const botMember = interaction.guild.members.me;

        // Validação: se o cargo é gerenciável pelo bot
        if (!role.editable || role.position >= botMember.roles.highest.position) {
            return await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`:x: | Não posso atribuir este cargo. Certifique-se de que o cargo está abaixo do cargo mais alto do bot e que o bot tem permissão para gerenciá-lo.`)
                        .setColor("Red"),
                ],
                ephemeral: true,
            });
        }

        // Validação: se o cargo é @everyone
        if (role.id === interaction.guild.id) {
            return await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`:x: | Não é possível definir o cargo @everyone como autorole.`)
                        .setColor("Red"),
                ],
                ephemeral: true,
            });
        }

        try {
            await db.set(`${interaction.guild.id}.AutoRole`, role.id);

            const embed = new Discord.EmbedBuilder()
                .setColor("#9D4EDD")
                .setTitle(`☁️ Autorole Configurado!`)
                .setDescription(`O cargo ${role} será atribuído automaticamente a novos membros.\n\n🔹 Powered by AETHER`)
                .setFooter({ text: "AETHER • Automação Cósmica" });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(`[Autorole Error] Erro ao definir o autorole:`, error);
            await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`:x: | Ocorreu um erro ao tentar definir o autorole. Tente novamente ou contate o suporte.`)
                        .setColor("#FF4D4D")
                        .setFooter({ text: "AETHER • Automação Cósmica" })
                ],
                ephemeral: true,
            });
        }
    },
};
