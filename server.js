const Websocket = require("ws")
const express = require("express")
const events = require("events");
var usernames = []
var dn = false
var n = 0
const sleep = async (ms) => new Promise((re) => setTimeout(re , ms) )
let db = require('./db');
let tokens = require('./db/tokens.js')
let database = db.init();

let statues = ["idle" , "dnd" , "online"]
const app = express()

app.get("/" , (req , res) => res.send("OK"))

app.listen(3000)
//const maxbot = require("./maxbot")

const client = class extends events {

constructor(token , id) {
super();
this.closed = false
this.first = true
this.id = id
this.token = token
this.ws = null

this.seq = 0
this.status = statues[Math.floor(Math.random()*statues.length)]
this._onclose(true)
}


_onmessage(msg) {
let m;
try {m = JSON.parse(msg)} catch { return; }

if(m.s) { this.seq = m.s }

if(m.op === 10) {
this.inv = setInterval(() => this.ws.send(JSON.stringify({"op":1,"d": this.seq})) , m.d.heartbeat_interval)
let auth = (token) => {
  this.ws.send(`{"op":2,"d":{"token":"${token}","capabilities":125,"properties":{"os":"Windows","browser":"Chrome","device":"","system_locale":"ar-AE","browser_user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36","browser_version":"91.0.4472.101","os_version":"10","referrer":"https://discord.com/channels/793203630978498560/853614357865562123","referring_domain":"discord.com","referrer_current":"","referring_domain_current":"","release_channel":"stable","client_build_number":87709,"client_event_source":null},"presence":{"status":"${this.status}","since":0,"activities":[],"afk":false},"compress":false,"client_state":{"guild_hashes":{},"highest_last_message_id":"0","read_state_version":0,"user_guild_settings_version":-1}}}`)
}
return auth(this.token)
}

if(m.t === "READY") {

this.closed = false
var data = m.d

let user = data.user 

if(!usernames.includes(user.username)){
usernames.unshift(user.username)
}else{
n++
console.log(n)
}



user.verified = data.user.verified
user.require_verified = data.required_action ? true : false
user.require_phone = data.required_action === "REQUIRE_VERIFIED_PHONE" ? true : false
console.log( m.d.guilds.length + "| " + "[" + this.id + "] " + user.username + " is ready" + ` | ${user.require_verified ? `Require ${user.require_phone ? "Phone" : "Email"}` : "Not Required"}`)

if(this.first) { this.emit("done" , user); this.first = false };
try {
this.ws.send(`{
  "op": 3,
  "d": {
    "since": 91879201,
    "activities": [],
    "status": "${this.status}",
    "afk": false
  }
}`)
} catch {}
}

}

async _onclose(ms) {

if(ms) { await sleep(ms) }

try { this.ws.close() } catch { }
try { clearInterval(this.inv) } catch { }

this.ws = new Websocket("wss://gateway.discord.gg/" , [])
this.ws.on("message" , (msg) => this._onmessage(msg))
this.ws.on("close" , () => { 
if(!this.closed) { console.log("closed "+ this.id); }
this.closed = true
this.seq = 0
if(this.first) { this.emit("done" , false); this.first = false };
this._onclose(10000)
})
this.ws.on("error" , (err) => this._onerror(err))
}


_onerror(err) {
this._onclose()
}

}







const fs = require("fs")
const fetch = require("node-fetch")

let id = 0
let clients = []
var end = false

let func = async () => {

  let dataFetch = await fetch('https://our-society.glitch.me/api/v1/tokens?code=v12', {headers: {authorization: process.env.token}})
  
  let tokens = await dataFetch.text()
let s = tokens

for(let c of s.split('\n')){
  
  var data =  c.split(':')[2] ? c.split(':')[2] : c.split(':')[0]
  
if(!clients.find(d => d.token === data)) {
id++
let c = new client(data.trim() , id)
clients.push(c)
await new Promise((re) =>{
        var connect = false
  setTimeout(() =>{
if(connect === false) re()
    connect = true
}, 25000)
c.once("done" , () =>{
      connect = true

re();
})
})
}

}
  end = true
}

func();