const request = require("axios");
const { Extra} = require('telegraf');
const Discord = require("discord.js");


var hathorInfo = {
    date: "",
    valueUSD: 0.00,
    rank: "",
    marketCap_usd: 0.00,
    marketCap_btc: 0.00,
    circulatingSupply: 0.00,
    circulatingSupplyTotal: 0.00,
    volume24h_usd: 0.00,
    volume24h_btc: 0.00,
    exchanges: ["https://qtrade.io/market/HTR_BTC","https://trade.kucoin.com/HTR-USDT"]
}

const meses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];

async function getInfo(typeMessage, msg) {    
    return new Promise((resolve, reject) => {
        try {            
            request.get(`https://coinpaprika.com/coin/htr-hathor-network/`, {
               
            })
                .then(function (response) {

                    if (response.data) {    
                        let dateNow = new Date();
                        hathorInfo["date"] = ((meses[(dateNow.getMonth())] + " " + dateNow.getDate() + ", " + dateNow.getFullYear() + " - " + (dateNow.getHours()<10?'0':'') + dateNow.getHours()+ ":" +(dateNow.getMinutes()<10?'0':'') + dateNow.getMinutes()+":"+(dateNow.getSeconds()<10?'0':'') + dateNow.getSeconds()));

                        var matchesValue = response.data.match(/<span\s+id="coinPrice"\s+data-recalc="[\S\s]*?">[\S\s]*?<\/span>/gi);                        
                        hathorInfo["valueUSD"] = matchesValue[0].replace(/(<\/?[^>]+>)/gi, '').replace(/\s/g, '');

                        var matchesRank = response.data.match(/<span\s+class="cp-rank-label cp-rank-label--coin">[\S\s]*?<\/span>/gi);                        
                        hathorInfo["rank"] = matchesRank[0].replace(/(<\/?[^>]+>)/gi, '').replace("Rank ", '');                        

                        const regexMarketCap = /<div class="cp-coin__bottom-small cp-coin__bottom-small--market-cap"><span><em data-recalc="([\S\s]*?)">([\S\s]*?)<\/em>([\S\s]*?)<\/span><\/div>/gi;                        
                        let m = regexMarketCap.exec(response.data);
                        hathorInfo["marketCap_usd"] = m[2].replace(/\s\s+/g, ' ');
                        hathorInfo["marketCap_btc"] = m[3].replace(/\s\s+/g, ' ');

                        const regexCirculatingSupply = /<div class="cp-coin__bottom-small"><span><em>([\S\s]*?)<\/em><small>Total: ([\S\s]*?)<\/small><\/span><\/div>/gi;
                        let n = regexCirculatingSupply.exec(response.data);
                        hathorInfo["circulatingSupply"] = n[1].replace(/\s\s+/g, ' ');
                        hathorInfo["circulatingSupplyTotal"] = n[2].replace(/\s\s+/g, ' ');

                        const regexVolume = /<div class="cp-coin__bottom-small"><span><em data-recalc="([\S\s]*?)">([\S\s]*?)<\/em>([\S\s]*?)<\/span><\/div>/gi;
                        let o = regexVolume.exec(response.data);
                        hathorInfo["volume24h_usd"] = o[2].replace(/\s\s+/g, ' ');
                        hathorInfo["volume24h_btc"] = o[3].replace(/\s\s+/g, ' ');

                        if (typeMessage == "Discord")
                        {
                            const messageEmbedded = new Discord.MessageEmbed()
                            .setColor('#000000')
                            .setAuthor('Hathor Network','https://pbs.twimg.com/profile_images/1205138650478075904/jeN_tEQQ_400x400.jpg')
                            .setURL('https://coinpaprika.com/coin/htr-hathor-network')
                            .setTitle(hathorInfo["date"])
                            .addFields(
                                { name: "USD Value", value: hathorInfo["valueUSD"], inline: true},
                                { name: "Rank", value: hathorInfo["rank"], inline: true},
                                { name: '\u200B', value: '\u200B' },    
                                { name: "Market Cap", value: hathorInfo["marketCap_usd"]+'\n'+hathorInfo["marketCap_btc"], inline: true},
                                { name: "Circulating Supply", value: hathorInfo["circulatingSupply"]+'\nTotal: '+hathorInfo["circulatingSupplyTotal"], inline: true},
                                { name: "Volume (24h)", value: hathorInfo["volume24h_usd"]+'\n'+hathorInfo["volume24h_btc"], inline: true},
                                { name: '\u200B', value: '\u200B' },    
                                { name: "Exchanges", value: hathorInfo["exchanges"], inline: false},        
                            )
                            .setFooter("See more details https://coinpaprika.com/coin/htr-hathor-network/")                
                                                                                          
                            msg.channel.send(messageEmbedded);

                        }else if(typeMessage == "Telegram")
                        {                            
                            var msgHead = `<b>Hathor Network Bot</b> - `+hathorInfo["date"]+`\n<b>USD Value:</b> `+hathorInfo["valueUSD"]+`\n<b>Rank:</b> `+hathorInfo["rank"]+`\n\n`;
                            var msgBody = `<b>------Market Cap------</b>\n`+hathorInfo["marketCap_usd"]+`\n`+hathorInfo["marketCap_btc"]+`\n\n<b>------Circulating Supply------</b>\n`+hathorInfo["circulatingSupply"]+`\n<b>Total:</b> `+hathorInfo["circulatingSupplyTotal"]+`\n\n<b>------Volume(24h)------</b>\n`+hathorInfo["volume24h_usd"]+`\n`+hathorInfo["volume24h_btc"]+`\n\n`;
                            var msgFooter = `<b>Exchanges</b>\n`+hathorInfo["exchanges"][0]+`\n`+hathorInfo["exchanges"][1]+`\n\n<b>See more details </b> <a href="https://coinpaprika.com/coin/htr-hathor-network">here</a>`;                    

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