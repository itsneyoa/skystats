const Discord = require('discord.js');

module.exports = {
    name: 'hewwo',
    aliases: ['owo', 'uwu'],
    usage: 'hewwo',
    description: 'Says hewwo!',
    guildOnly: false,
    execute(message, args) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('(◕ᴗ◕✿)')
                .setDescription(`hewwo ${message.author} 😘`)
                .setColor(Math.floor(Math.random() * 16777215).toString(16))
                .setFooter('( ﾟ◡ﾟ)/')
        )
    },
};