const Discord = require('discord.js');

module.exports = {
    name: 'skin',
    aliases: ['head', 'skull'],
    usage: 'skin [ign]',
    description: 'Gets player head from ign',
    execute(message, args) {
        if (!args[0]) {
            var ign = message.member.displayName;
        } else {
            if (message.mentions.members.first()) {
                var ign = message.mentions.members.first().displayName;
            }
            else var ign = args[0];
        } // Gets IGN

        ign = ign.replace(/\W/g, ''); // removes weird characters

        return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/300.png`)
                .setImage(`https://cravatar.eu/helmavatar/${ign}/600.png`)
                .setColor('7CFC00')
        )
    },
};