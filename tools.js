const request = require("axios");
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
    exchanges: ["https://qtrade.io/","https://www.kucoin.com"]
}

async function getInfo(msg) {    
    return new Promise((resolve, reject) => {
        try {            
            request.get(`https://coinpaprika.com/coin/htr-hathor-network/`, {
               
            })
                .then(function (response) {

                    if (response.data) {                              
                        hathorInfo["date"] = new Date().toLocaleString()

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


                        const messageEmbedded = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setAuthor('Hathor Network','https://pbs.twimg.com/profile_images/1205138650478075904/jeN_tEQQ_400x400.jpg')
                            .setTitle('Hathor Info - '+hathorInfo["date"])
                            .addFields(
                                { name: "USD Value", value: hathorInfo["valueUSD"], inline: true},
                                { name: "Rank", value: hathorInfo["rank"], inline: true},
                                { name: '\u200B', value: '\u200B' },    
                                { name: "Market Cap", value: hathorInfo["marketCap_usd"]+'\n'+hathorInfo["marketCap_btc"], inline: true},
                                { name: "Circulating Supply", value: hathorInfo["circulatingSupply"]+'\n'+hathorInfo["circulatingSupplyTotal"], inline: true},
                                { name: "Volume (24h)", value: hathorInfo["volume24h_usd"]+'\n'+hathorInfo["volume24h_btc"], inline: true},
                                { name: '\u200B', value: '\u200B' },    
                                { name: "Exchanges", value: hathorInfo["exchanges"], inline: false},        
                            )
                            .setFooter("Informações retiradas do CoinPaprika, https://coinpaprika.com/")                
                                                                                          
                        msg.channel.send(messageEmbedded);

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