const { Telegraf } = require('telegraf')
const config = require("./config.json");
const tools = require("./tools.js");

var hathorinfo = []

const bot = new Telegraf(config.BOT_TELEGRAM_TOKEN)
bot.command('info', (ctx) => {
    tools.getInfo("Telegram", ctx);
})
    
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



                                    
