const { PermissionsBitField, ComponentType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Discord = require("discord.js")
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "deletsugestão",
    description: "Deletar canal",
    type: 1,
    permissions: {},
    run: async (client, interaction, args) => {



        try{
             interaction.guild
      
           
    
      db.delete(`canalsugestao_${interaction.guild.id}`)
            interaction.reply({ content: `✅ Canal deletado com sucesso`})
        } catch(e) {
            return console.log(e)   
        }
    } 
    }