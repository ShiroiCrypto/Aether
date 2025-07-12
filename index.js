require('dotenv').config();
const {Client, GatewayIntentBits, Collection, Partials} = require("discord.js");
console.clear()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
  partials: Object.keys(Partials)
});

module.exports = client;
client.slashCommands = new Collection();

const { owner } = require('./config.json');

// Troque BOT_TOKEN por TOKEN para usar o padrão .env
client.login(process.env.TOKEN);

const evento = require("./handler/Events");
evento.run(client);
require("./handler/index")(client);

const { initAether } = require('./function/aetherHandler');
initAether(client);

process.on('unhandRejection', (reason, promise) => {
  console.log(`🚫 Erro Detectado:\n\n` + reason, promise);
});

process.on('uncaughtException', (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n` + error, origin);
});

