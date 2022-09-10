module.exports = (client) => {
console.log(client.user.username + " " + client.user.id)

//client.guilds.get("904026603732992041").leave();
//client.addGuildMemberRole("904026603732992041", "214488161739472896", "910216886808092672")

client.createGuildCommand("686217334926737436",{
name: "ping",
description: "ping bot",
options: []
})

}