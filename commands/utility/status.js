const Discord = require('discord.js');
const statuses = ["PLAYING", "LISTENING", "WATCHING", "COMPETING"];

module.exports = {
    name: 'status',
    aliases: ['presence', 'setstatus'],
    usage: 'status <statusType> <statusMessage>',
    description: 'Sets bot status',
    ownerOnly: true,
    execute(message, args) {
        if (!args.length) {
            return message.client.user.setActivity()
                .then(message.channel.send(
                    new Discord.MessageEmbed()
                        .setDescription(`Status removed!`)
                        .setColor('7CFC00')
                ))
        }

        const status = args[0].toUpperCase();

        if (!isValidStatus(status)) return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`Invalid status type`)
                .addField("Valid types:", statuses.join('\n'))
                .setColor('DC143C')
        );

        if (args.length == 1) return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`You need a message as well as a status type`)
                .setColor('DC143C')
        )

        args.shift();

        message.client.user.setActivity(args.join(' '), { type: status })
            .then(message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`Status successfully set to \`${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() + ' ' + args.join(' ')}\``)
                    .setColor('7CFC00')
            ))
    },
};

function isValidStatus(status) {
    return statuses.includes(status);
}