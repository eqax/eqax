const Eris = require("eris");
const axios = require("axios");
const fs = require("fs");


class Main extends Eris {
    constructor(token, options, db) {
        super(token, options);
        this.cooldowns = {};
        this.buttonsCallback = {};
        this.db = db;
        ///////////////////////////////////////

        this.oauth = {};

        ///////////////////////////////////////

        this._loadCommands = () => {
            this.commands = [];
            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=")
            let ccc = [];
            for (let dir of fs.readdirSync(__dirname + "/commands/")) {
                const commands = fs
                    .readdirSync(__dirname + `/commands/${dir}/`)
                    .filter(file => file.endsWith(".js"));

                let cmds = [];

                for (let file of commands) {
                    try { delete require.cache[require.resolve(`../maxbot/commands/${dir}/${file}`)]; } catch {}
                    let command = require(`../maxbot/commands/${dir}/${file}`);
                    if (command.name) {
                        command.dir = dir
                        cmds.push(`- ${command.name}`);
                        this.commands.push(command);
                    }
                }
                ccc.push(
                    `${dir.charAt(0).toUpperCase() + dir.slice(1)} Commands:\n${cmds.join(
"\n"
)}`
                );
            }
            console.log(ccc.join("\n---------------------------------\n"));
            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
            return this.commands.length;
        };
        this._loadEvents = async () => {
            const events = fs
                .readdirSync(__dirname + `/events/`)
                .filter(file => file.endsWith(".js"));

            for (let file of events) {
                let event = require(`../maxbot/events/${file}`);
                let name = file.split(".")[0];
                this.on(name.split("_").join(""), (...args) => event(this, ...args));
            }
        };


        this._loadEvents();
        this._loadCommands();

        this.connect();
    }
}

module.exports = Main;