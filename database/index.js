const { JsonDatabase } = require("wio.db");
const { QuickDB } = require("quick.db");
const {owner} = require("../config.json");


const db = new JsonDatabase({databasePath:"./database/general.json"});
const tk = new QuickDB({filePath:"./database/ticket.sqlite"});

function getDBAetherChat() {
    return new JsonDatabase({ databasePath: "./database/aetherChat.json" });
}

module.exports = {
    owner,
    db,
    tk,
    getDBAetherChat
};