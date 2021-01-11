# Hathor's Discord and Telegram Bot

## Portuguese
Para facilitar a vida dos usuários no canal do discord da Hathor (https://discord.gg/aWukZZX) e no Telegram (https://t.me/HathorOfficial) trazendo informações precisas e corretas sem aqueles banners quando você envia um link de uma exchenge, resolvi criar esse bot que passa informações em tempo real para o canal. Basta digitar **.info** no Discord e **/info** no Telegram.

## English
To make life easier for users on Hathor's discord channel (https://discord.gg/aWukZZX) and Telegram (https://t.me/HathorOfficial) bringing accurate and correct information without those banners when you send a link of an exchenge, I decided to create this bot that passes information in real time to the channel. Just type **.info** on Discord and **/info** on Telegram.
 
## Node Version: v15+

### Portuguese
Para funcionar, você tem que instalar os seguintes pacotes:

`npm install discord.js`
`npm install axios`
`npm install telegraf`

e depois basta adicionar a KEY do seu BOT no arquivo config.json

```
{
    "BOT_DISCORD_TOKEN": "DISCORD_BOT_KEY",
    "BOT_TELEGRAM_TOKEN": "TELEGRAM_BOT_KEY"
}

```

e executar o comando:
    
`node startDiscord.js` -> to work on discord
`node startTelegram.js` -> to work on telegram

### English
To work, you have to install the following packages:

`npm install discord.js`
`npm install axios`
`npm install telegraf`


Then just add your BOT KEY in the config.json file

```
{
    "BOT_DISCORD_TOKEN": "DISCORD_BOT_KEY",
    "BOT_TELEGRAM_TOKEN": "TELEGRAM_BOT_KEY"
}

```

and run the command:
    
`node startDiscord.js` -> to work on discord
`node startTelegram.js` -> to work on telegram

Discord:
<img src="https://github.com/mbnunes/hathor-bot/blob/main/imgs/bot.png">

Telegram:
<img src="https://github.com/mbnunes/hathor-bot/blob/main/imgs/botTelegram.png">