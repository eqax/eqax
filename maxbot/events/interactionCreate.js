const ws = require("ws");
const config = require("../config.js");
const probotID = "282859044593598464";

module.exports = async (client, command) => {
  var time = Date.now()
  
await command.createMessage(`pong`)

await command.editMessage("@original", `${Date.now() - time}**ms**`)






}