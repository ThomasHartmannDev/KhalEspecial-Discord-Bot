const CoinGecko = require('coingecko-api')
const { MessageEmbed } = require('discord.js');
const Cg = new CoinGecko();
const Discord = require('discord.js');
const client = new Discord.Client({ intents: Discord.Intents.FLAGS.GUILDS | Discord.Intents.FLAGS.GUILD_MESSAGES });
module.exports = class CotacaoCommand {
    constructor(){
        this.name = 'cotacao'
    }

    async run(message, args){
        const { data } = await Cg.simple.price({
            ids: ['smooth-love-potion'],
            vs_currencies: ['usd', 'brl'],
        });
        console.log(data)
        const slp_dolar =  JSON.stringify(data['smooth-love-potion']['usd'])
        const slp_real = JSON.stringify(data['smooth-love-potion']['brl'])

        const cotacao_embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Cotação SLP')
            .addFields(
                { name: 'Dolar:', value: `Dolar: ${slp_dolar}`},
                { name: 'Real', value: `Real: ${slp_real}` },
            )
            .setTimestamp()
            
        const target = client.channels.cache.get('855106908461203468')
        target.send({embeds:[cotacao_embed]})
        //return message.reply({embeds:[cotacao_embed]})
    }
}