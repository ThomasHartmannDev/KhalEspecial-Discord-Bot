


module.exports = class InfoCommand {
    constructor(){
        this.name = 'info'
    }

    run(message, args){
        return message.reply('info')
    }
}