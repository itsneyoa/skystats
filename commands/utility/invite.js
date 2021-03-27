const Discord = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: 'invite',
    aliases: ['i', 'inv'],
    usage: 'Invite me to your server!',
    description: 'invite',
    execute(message, args) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor('neyoa', 'https://cravatar.eu/helmavatar/neyoa/600.png', 'https://neyoa.me')
                .setDescription(`Hi! I'm still working on a few things before the bot is ready to scale for more than a few servers. Hopefully not long now!`)
                .setColor('DC143C')
                .setFooter('Join my discord for more updates!')
                .setTimestamp()
        )
    },
};