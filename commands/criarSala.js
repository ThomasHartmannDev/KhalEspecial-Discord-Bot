const { MessageEmbed, Permissions } = require('discord.js');
const Discord = require('discord.js');

const CATEGORY_VOICE_NAME = "🎤│Scholars Voice Channel's"
const CATEGORY_TEXT_NAME = "💬│Scholars Chat Channel's"
const CATEGORY_MAX_CHANNELS = 50
const client = new Discord.Client({ intents: Discord.Intents.FLAGS.GUILDS | Discord.Intents.FLAGS.GUILD_MESSAGES });

module.exports = class CriarSalaCommand {
    constructor() {
        this.name = 'criarsala' //50 é o max // tem que fazer o bot indentificar uma categoria com 1 nome em especifico 
        //verificar se ela ta full se ela tiver criar outra com o mesmo nome
        // entendeu ?? ok vou pegar o nome da categoria são 2 categorias viu uma de voice e uma de text blz
        // NOME CATEGORIA TEXT : 💬│Scholars Chat Channel's
        // NOME CATEGORIA VOICE :🎤│Scholars Voice Channel's
        // OS 2 CANAIS DO SERVIDOR DEV LÁ TA COM 50 CANAIS DENTRO JÁ carai
        // pega as perm da categoria certim
        // Sem linkar as perm da categoria as perm da categoria deixa como se fosse uma categoria normal criada
        // por dia das duvidas so marca que everyone não pode ver ok
        //acchhoooo que é isso bora de test não funcionou KKKKKKKK 
        // 
        this.needPermissions = [Permissions.FLAGS.ADMINISTRATOR]

    }

    async run(message, args) {
        if (args == 0) {
            return message.reply('você precisa dizer o numero da sala.')
        } else {
            const reply = await message.reply('Criando cargos e salas...')
            let name = `${args[0]}│`
            const role = await message.guild.roles.create({
                name: `${name}`,
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

            let voiceCategory = message.guild.channels.cache
            .filter(channel => channel.name.startsWith(CATEGORY_VOICE_NAME) && channel.type == 'GUILD_CATEGORY')
            .sort((a,b) => a.children.size - b.children.size) // ordena pelo menor numero de canais dentro da categoria para nao precisar criar outro se tiver menos de 50
            .first(); // como é uma collection pegar o primeiro valor ou null
            if (!voiceCategory || voiceCategory.children.size >= CATEGORY_MAX_CHANNELS) {
                voiceCategory = await message.guild.channels.create(CATEGORY_VOICE_NAME,
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


            const textChannel = await message.guild.channels.create(name, {
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

            const voiceChannel = await message.guild.channels.create(name, {
                type: "GUILD_VOICE",
                parent: voiceCategory,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'CONNECT']
                    },
                    {
                        id: role.id,
                        allow: ['VIEW_CHANNEL', 'CONNECT']

                    }

                ]
            })

            await reply.edit(`Cargos e canais criados com o seguinte nome: ${args[0]}`);
        }
    }
}