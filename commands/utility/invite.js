const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['i', 'inv'],
    usage: 'invite',
    description: 'Invite me to your server!',
    execute(message, args) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(`SkyStats is now public!`, message.client.user.avatarURL())
                .setDescription([
                    `You can invite me [here](https://skystats.neyoa.me).`,
                    `To see updates, outages, request features and report issues join my discord [here](https://discord.neyoa.me)`,
                    `Please note if it's added to 100 servers I'll need verification to expand even more.`,
                    `Thanks for using SkyStats!`,
                    `- neyoa ❤`
                ])
                .setColor('7CFC00')
                .setTimestamp()
        )
    },
};