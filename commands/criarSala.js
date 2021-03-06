const { MessageEmbed, Permissions } = require('discord.js');
const Discord = require('discord.js');

const CATEGORY_SCHOLAR_DATA = "📊│Scholars Data Channel's"
const CATEGORY_TEXT_NAME = "💬│Scholars Chat Channel's"
const CATEGORY_MAX_CHANNELS = 50
const client = new Discord.Client({ intents: Discord.Intents.FLAGS.GUILDS | Discord.Intents.FLAGS.GUILD_MESSAGES });

module.exports = class CriarSalaCommand {
    constructor() {
        this.name = 'criarsala'
        this.needPermissions = [Permissions.FLAGS.ADMINISTRATOR]
    }

    async run(message, args) {
        if (args == 0) {
            return message.reply('você precisa dizer o numero da sala.')
        } else {
            const reply = await message.reply('Criando cargos e salas...')
            let name = `${args[0]}│`
            let name_role = `${args[0]}`
            const role = await message.guild.roles.create({
                name: `${name_role}`,
                permissions: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CREATE_INSTANT_INVITE,
                Permissions.FLAGS.CHANGE_NICKNAME, Permissions.FLAGS.CONNECT, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.ATTACH_FILES,
                Permissions.FLAGS.USE_EXTERNAL_EMOJIS, Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.CONNECT],
                mentionable: false
            });

            let textCategory = message.guild.channels.cache
            .filter(channel => channel.name.startsWith(CATEGORY_TEXT_NAME) && channel.type == 'GUILD_CATEGORY')
            .sort((a,b) => a.children.size - b.children.size)
            .first();
            if (!textCategory || textCategory.children.size >= CATEGORY_MAX_CHANNELS) {
                textCategory = await message.guild.channels.create(CATEGORY_TEXT_NAME, {
                    type: 'GUILD_CATEGORY',
                    permissionOverwrites: [
                        {
                            id: message.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                        }]
                }
                )
            }

            let ScholarsDataCategory = message.guild.channels.cache
            .filter(channel => channel.name.startsWith(CATEGORY_SCHOLAR_DATA) && channel.type == 'GUILD_CATEGORY')
            .sort((a,b) => a.children.size - b.children.size) // ordena pelo menor numero de canais dentro da categoria para nao precisar criar outro se tiver menos de 50
            .first(); // como é uma collection pegar o primeiro valor ou null
            if (!ScholarsDataCategory || ScholarsDataCategory.children.size >= CATEGORY_MAX_CHANNELS) {
                ScholarsDataCategory = await message.guild.channels.create(CATEGORY_SCHOLAR_DATA,
                    {
                        type: 'GUILD_CATEGORY',
                        permissionOverwrites: [
                            {
                                id: message.guild.roles.everyone,
                                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                            }
                        ]
                    });
                }


            const textChannel_user = await message.guild.channels.create(name, {
                type: "GUILD_TEXT",
                parent: textCategory,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    },
                    {
                        id: role.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES']

                    }

                ]
            })

            const textChannel_adm = await message.guild.channels.create(name_role, {
                type: "GUILD_TEXT",
                parent: ScholarsDataCategory,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    }

                ]
            })

            await reply.edit(`Cargos e canais criados com o seguinte nome: ${args[0]}`);
        }
    }
}