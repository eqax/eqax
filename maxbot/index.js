const logoCreator = require('asciiart-logo');
const fs = require("fs");
const Client = require("../maxbot/client.js");
const config = require("../maxbot/config.js")

const client = new Client(config.bot_token, {
    defaultImageSize: 2048,
    defaultImageFormat: "png",
});

let logo = logoCreator({
    name: "SS-HELPER",
    font: 'Big',
    lineChars: 15,
    padding: 5,
    margin: 2
}).render();
console.log(logo);

