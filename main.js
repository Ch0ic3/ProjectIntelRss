var Parser = require("rss-parser")
const db = require("./db")
const readline = require("readline")
const fs = require("fs")
require("dotenv").config()
require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
let parser = new Parser()
const {Client, Events, GatewayIntentBits} = require("discord.js");

const client= new Client({intents: [GatewayIntentBits.GuildMessages]})

var ids = []

async function sendNews(msg){
    guilds = await client.guilds.fetch()
    guilds.forEach(async function(guild) {
        guild = client.guilds.cache.get(guild.id)
        chans = await guild.channels.fetch()
        chans.forEach(async function(channel){
            if(channel.name === "『📰』cyber-rss"){
                console.log(channel.id)
                await channel.send(msg)
            }
            else if (channel.name === "intelnews")
            {
                await channel.send(msg)
            }
        })
    })
}


var parse = async url => {
    await 
    console.log("Checking feed")
    console.log(url)
    try {
        var feed = await parser.parseURL(url)
    }
    catch {
        return "ERROR"
    }
    console.log(feed.title)

    feed.items.forEach(item => {
        let data = item.title + item.pubDate
        let buff = new Buffer(data)
        let str = buff.toString("base64")

        db.all("select * from data where name = (?)",[str],async function(err, row){
            if (err) {
                console.log("ERROR")
                console.log(err)
            } else {
                if (!row.length > 0){                    
                    db.run(
                        `insert into data (name) values (?)`,
                        [str],
                    )
                    console.log("TEST " + item.title)
                    //console.log(`${item.title} - ${item.link}${item.pubDate}}\n`)
                    await sendNews(`${item.title}\n${item.pubDate}\n${item.link}`)

                } else {

                }
            }

        })
    })

}

function timedfuction(){
    setTimeout(function(){
        console.log("TimedFunction")
        timedfuction()
    }, 1000*1)
}

function sleep(ms)
{
    return new Promise(r => setTimeout(r,ms))
}


client.on("ready",async function(c){
    console.log(c.user)
    await sendNews("News Bot online again!")
    listen()
    await sendNews("Checking feeds...")
})


async function listen()
{
    while(true){
        const filestream = fs.createReadStream("feed.txt")
        const rl = readline.createInterface({
            input:filestream,
            crlfDelay:Infinity
        })
        for await(var line of rl){
            await parse(line)
        }
    }
}

client.login(process.env.TOKEN)
