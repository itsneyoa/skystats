const Discord = require('discord.js');

module.exports = {
    name: 'wedding',
    aliases: ['wed', 'ace',, 'disq'],
    usage: 'wedding',
    description: 'Holds a beautiful wedding ceremony',
    execute(message, args) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor('Welcome to the wedding of Ace and Disqbled!', 'https://pngimg.com/uploads/heart/heart_PNG51183.png')
                .setDescription(`Unfortunately the wedding has been called off last minute. You can all go home now.`)
                .setColor('F42069')
                .setFooter('Now shush about marrying them :)')
                .setTimestamp()
        )
    },
};