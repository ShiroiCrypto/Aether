// => Status: Sistema de Informações no Console.
const client = require("../../index.js");
const Discord = require('discord.js');

client.on("ready", () => {
  const messages = [
    `🍼 Fazendo NewBorn!`, // Status 2
    `🍉 Fazendo Baby!`, // Status 3
    `🩷 Fazendo Fofuxos!`, // Status 1
    `🍒 Fazendo Kids!`, // Status 4
    `📱 Fazendo Pre-Teen!`, // Status 5
    `🍧 Fazendo Teen!`, // Status 6
    `🍟 Fazendo Adulto!`, // Status 7
  ]

  var position = 0;

  setInterval(() => client.user.setPresence({
    activities: [{
      name: `${messages[position++ % messages.length]}`,
      type: Discord.ActivityType.Streaming,
      url: 'https://www.twitch.tv/TwitchStatusServer'
    }]
  }), 1000 * 10);

  client.user.setStatus("online");
});