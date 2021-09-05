module.exports = class PingCommand {
    constructor(){
        this.name = 'ping',
        this.aliases = ['pong']
    }

    run(message, args){
        return message.reply('pong')
    }
}