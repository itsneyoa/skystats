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
                .setDescription([
                    `SkyStats is now public! You can invite me [here](https://skystats.neyoa.me).`,
                    `To see updates, outages, request features and report issues join my discord [here](https://discord.neyoa.me)`,
                    `Please note if it's added to 100 servers I'll need verification to expand even more.`,
                    `Thanks for using SkyStats!`,
                    `- neyoa ❤`
                ])
                .setColor('DC143C')
                .setFooter('owo')
                .setTimestamp()
        )
    },
};