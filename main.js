const Discord = require('discord.js');
const client = new Discord.Client({ intents: Discord.Intents.FLAGS.GUILDS | Discord.Intents.FLAGS.GUILD_MESSAGES });
const config = require('./data/config.json');
const fs = require('fs');
const CoinGecko = require('coingecko-api')
const { MessageEmbed } = require('discord.js');
const Cg = new CoinGecko();
// map [key: nomeComando, value: arquivoComando]
// collection é uma extensão do Map nativo do javascript
const commands = new Discord.Collection();
/// essa funcao foi feita para poder recarregar os comandos sem precisar reiniciar o bot por isso o clear
const registrarComandos = async () => {
    commands.clear();
    // deleta o cache dos arquivos
    for (const file of fs.readdirSync(`${__dirname}/commands`)) {
        delete require.cache[`${__dirname}/commands/${file}`];
    }

    // recarrega os comandos
    const { PingCommand, InfoCommand, CotacaoCommand } = require(`./commands/index.js`);
    const registarComando = (comando) => {
        console.log('adicionando comando', comando.name)
        commands.set(comando.name, comando);
        for (const alias of comando.aliases || []) {
            console.log('alias', alias)
        }
    };

    registarComando(new PingCommand());
    //registarComando(new InfoCommand());
    //registarComando(new CotacaoCommand());
};

registrarComandos();


client.on('messageCreate', message => {
    const ehMensagemInvalida =
        !message.author
        || message.author?.bot // ?. para acessar propriedades que podem ser null
        || message.webhookId // nao responder hook
        || message.thread // nao responder thread
        || !message.guild // apenas em guilds
        || message.applicationId // nao responder qualquer outro tipo de mensagem
    if (ehMensagemInvalida) return;

    const prefix = config.prefixes.find(prefix => message.content.startsWith(prefix))
    if (!prefix)
        return;

    const args = message.content.split(' ');
    //args poderia ser ['!Ping', 'Djinn'] vira => '!Ping' => toLower '!ping' => slice prefix => 'ping' 
    const cmd = args.shift()?.toLowerCase()?.slice(prefix.length);
    if (!cmd || !commands.has(cmd))
        return

    console.log('comando recebido: ', message.content)
    const command = commands.get(cmd);
    try {
        command.run(message, args)
        console.log('comando ', command.name, 'executado')
    }
    catch (error) {
        console.log(`Erro executando o comando ${command.name}: `, error);
    }

})

setInterval(async function cotacao(){

    const { data } = await Cg.simple.price({
        ids: ['smooth-love-potion'],
        vs_currencies: ['usd', 'brl'],
    });
    const slp_dolar =  JSON.stringify(data['smooth-love-potion']['usd'])
    const slp_real = JSON.stringify(data['smooth-love-potion']['brl'])
    const cotacao_embed = new MessageEmbed()
        .setColor('#0099ff')
        //.setTitle('Cotação SLP')
        .setAuthor('Cotação SLP', 'https://i.imgur.com/ySbo5n8.png')
        .addFields(
            { name: ':flag_us:', value: `**Dolar:** ${slp_dolar}`},
            { name: ':flag_br:', value: `**Real:** ${slp_real}` },
        )
        .setTimestamp()
        .setFooter('Smooth love potion','https://i.imgur.com/ySbo5n8.png');
        

    console.log('function called')
    const target = client.channels.cache.get('855106908461203468')
    return target.send({embeds:[cotacao_embed]}) 
},300000)


// e aqui onde a desgraça acontece
client.login(config.token)
    .catch(console.log)
    .then(() => console.log('to vivo'));
