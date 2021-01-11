const Discord = require("discord.js");
const config = require("./config.json");
const tools = require("./tools.js");
const client = new Discord.Client();
const prefix = ".";

client.login(config.BOT_DISCORD_TOKEN);

client.on('message', async msg => {
    
    if (!msg.content.startsWith(prefix) || msg.author.bot) 
        return;

    const commandBody = msg.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();          
    
    switch(command){
        case "info":            
            tools.getInfo("Discord", msg);
            break; 
    }   
});