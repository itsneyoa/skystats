const Discord = require('discord.js');

module.exports = {
    name: 'hewwo',
    aliases: ['owo', 'uwu'],
    usage: 'hewwo',
    description: 'Says hewwo!',
    execute(message, args) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('(βα΄ββΏ)')
                .setDescription(`hewwo ${message.author} π`)
                .setColor(Math.floor(Math.random() * 16777215).toString(16))
                .setFooter('( οΎβ‘οΎ)/')
        )
    },
};