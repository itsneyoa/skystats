const Discord = require('discord.js');
const statuses = ["PLAYING", "LISTENING", "WATCHING", "COMPETING"];

module.exports = {
    name: 'status',
    aliases: ['presence', 'setstatus'],
    description: 'Sets bot status',
    execute(message, args) {
        if (!isOwner(message.author.id)) return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`Sorry, you don't have permission to do this`)
                .setColor('DC143C')
        );

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

function isOwner(member) {
    delete require.cache[require.resolve('../../config.json')];
    const config = require('../../config.json');

    return member == config.discord.ownerId;
}

function isValidStatus(status) {
    return statuses.includes(status);
}