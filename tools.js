const request = require("axios");
const { Extra} = require('telegraf');
const Discord = require("discord.js");


var hathorInfo = {
    date: "",
    valueUSD: 0.00,
    valueBTC: 0.00,
    rank: "",
    marketCap_usd: 0.00,
    marketCap_btc: 0.00,
    circulatingSupply: 0.00,
    circulatingSupplyTotal: 0.00,
    valueMin: 0.00,
    valueMax: 0.00,
    volume24h_usd: 0.00,
    volume24h_btc: 0.00,
    exchanges: ["https://qtrade.io/market/HTR_BTC","https://trade.kucoin.com/HTR-USDT"]
}

const meses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];

async function getInfo(typeMessage, msg) {    
    return new Promise((resolve, reject) => {
        try {            
            request.get(`https://www.coingecko.com/en/coins/hathor`, {
                headers: {
                    'authority': 'www.coingecko.com',
                    'pragma': 'no-cache',                     
                    'cache-control': 'no-cache',
                    'upgrade-insecure-requests': '1',
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'sec-fetch-site': 'none',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-dest': 'document',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6,ru;q=0.5'
                }

            })
                .then(function (response) {          
                                     
                    if (response.data) {    
                        
                        let dateNow = new Date();
                        hathorInfo["date"] = ((meses[(dateNow.getMonth())] + " " + dateNow.getDate() + ", " + dateNow.getFullYear() + " - " + (dateNow.getHours()<10?'0':'') + dateNow.getHours()+ ":" +(dateNow.getMinutes()<10?'0':'') + dateNow.getMinutes()+":"+(dateNow.getSeconds()<10?'0':'') + dateNow.getSeconds()));

                        const matchesValue = /<span class="no-wrap" data-price-btc="([0-9.,]*?)" data-coin-id="12718" data-coin-symbol="htr" data-target="price\.price">\$([0-9.,]*?)<\/span>/gi;                        
                        let valueMatchesValue = matchesValue.exec(response.data);                        
                        hathorInfo["valueUSD"] = valueMatchesValue[2];
                        hathorInfo["valueBTC"] = valueMatchesValue[1];

                        const matchesRank = response.data.match(/Rank #([0-9]*)/gi);       
                        hathorInfo["rank"] = matchesRank[0].replace("Rank #", '');

                        const regexMarketCap = /<div class="mt-1">\n<span class="no-wrap" data-price-btc="([0-9,.]*?)" data-target="price\.price">\$([\S\s]*?)<\/span>/gi;
                        let valueRegexMarketCap = regexMarketCap.exec(response.data);
                        hathorInfo["marketCap_usd"] = valueRegexMarketCap[2];

                        const regex24hsTrade = /<div class="mt-1">\n<span class="no-wrap" data-price-btc="([0-9,.]*?)" data-no-decimal="false" data-target="price\.price">\$([\S\s]*?)<\/span>/gi;
                        let valueRegex24Trade = regex24hsTrade.exec(response.data);
                        hathorInfo["volume24h_usd"] = valueRegex24Trade[2];

                        const value24hs = /<span class="no-wrap" data-price-json="{[\S\s]*?}" data-target="price\.price">\$([0-9,.]*?)<\/span>\n\/\n<span class="no-wrap" data-price-json="{[\S\s]*?}" data-target="price\.price">\$([0-9,.]*?)<\/span>/gi;
                        let valueValue24hs = value24hs.exec(response.data);         
                        hathorInfo["valueMin"] = valueValue24hs[1];
                        hathorInfo["valueMax"] = valueValue24hs[2];

                        const regexCirculatingSupply = /<\/div>\n<div class="mt-1">\n([0-9,.]*?) \/ ([0-9,.]*?)\n<\/div>\n<\/div>\n<\/div>\n<\/div>\n<\/div>\n<\/div>/gi
                        let valueRegexCirculatingSupply = regexCirculatingSupply.exec(response.data);  
                        hathorInfo["circulatingSupply"] = valueRegexCirculatingSupply[1];
                        hathorInfo["circulatingSupplyTotal"] = valueRegexCirculatingSupply[2];

                        if (typeMessage == "Discord")
                        {
                            const messageEmbedded = new Discord.MessageEmbed()
                            .setColor('#000000')
                            .setAuthor('Hathor Network','https://pbs.twimg.com/profile_images/1205138650478075904/jeN_tEQQ_400x400.jpg')
                            .setURL('https://www.coingecko.com/en/coins/hathor')
                            .setTitle(hathorInfo["date"])
                            .addFields(
                                { name: "USD Value", value: hathorInfo["valueUSD"], inline: true},                                
                                { name: "Rank", value: hathorInfo["rank"], inline: true},
                                { name: "BTC Value", value: hathorInfo["valueBTC"], inline: false},
                                { name: '\u200B', value: '\u200B' },    
                                { name: "Market Cap", value: hathorInfo["marketCap_usd"]+'\n', inline: true},
                                { name: "Value Min/Max (24hs)", value: '$'+hathorInfo["valueMin"]+' / $'+hathorInfo["valueMax"], inline: true},
                                { name: "Circulating Supply", value: hathorInfo["circulatingSupply"]+'\nTotal: '+hathorInfo["circulatingSupplyTotal"], inline: true},                                
                                { name: "Volume (24h)", value: hathorInfo["volume24h_usd"]+'\n', inline: true},
                                { name: '\u200B', value: '\u200B' },    
                                { name: "Exchanges", value: hathorInfo["exchanges"], inline: false},        
                            )
                            .setFooter("See more details https://www.coingecko.com/en/coins/hathor")                
                                                                                          
                            msg.channel.send(messageEmbedded);

                        }else if(typeMessage == "Telegram")
                        {                            
                            var msgHead = `<b>Hathor Network Bot</b> - `+hathorInfo["date"]+`\n<b>USD Value:</b> `+hathorInfo["valueUSD"]+`\n<b>BTC Value:</b> `+hathorInfo["valueBTC"]+`\n<b>Rank:</b> `+hathorInfo["rank"]+`\n\n`;
                            var msgBody = `<b>------Market Cap------</b>\n`+hathorInfo["marketCap_usd"]+`\n\n<b>------Value Min/Max (24hs)------</b>\n`+hathorInfo["valueMin"]+` / `+hathorInfo["valueMax"]+`\n\n<b>------Circulating Supply------</b>\n`+hathorInfo["circulatingSupply"]+`\n<b>Total:</b> `+hathorInfo["circulatingSupplyTotal"]+`\n\n<b>------Volume(24h)------</b>\n`+hathorInfo["volume24h_usd"]+`\n`+hathorInfo["volume24h_btc"]+`\n\n`;
                            var msgFooter = `<b>Exchanges</b>\n`+hathorInfo["exchanges"][0]+`\n`+hathorInfo["exchanges"][1]+`\n\n<b>See more details </b> <a href="https://www.coingecko.com/en/coins/hathor">here</a>`;                    

                            msg.reply(msgHead+msgBody+msgFooter, {parse_mode: "HTML", disable_web_page_preview: true});
                        }

                        resolve();                        
                    } else {
                        reject("Falha ao pegar a informação");
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        }
        catch (ex) {
            resolve(ex);
        }
    });
}

module.exports = { getInfo }