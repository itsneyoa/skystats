const Discord = require('discord.js');
const config = require('../../config.json');
const package = require('../../package.json');

module.exports = {
	name: 'help',
    aliases: ['h', 'info'],
	description: 'Gets information about the bot',
	execute(message, args) {
		message.channel.send(
            new Discord.MessageEmbed()
            .setTitle('Help!')
            .addFields(
                {
                    name: "Stats",
                    value: [
                        `Maniacs check: \`check [ign]\``,
                        `Guild check :  \`guilcheck [ign]\``,
                        `Player weight:  \`weight [ign]\``,
                        `*If no ign is given, discord nick will be used*`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: "Utility",
                    value: [
                        `Help: \`help\``,
                        `Latency: \`ping\``,
                        `Reload: \`reload <command>\``,
                        `Status: \`status <type> <message>\``
                    ].join('\n'),
                    inline: true
                },
                {
                    name: "Info",
                    value: [
                        `Prefix: \`${config.discord.prefix}\``,
                        `Version: \`${package.version}\``,
                        `Issues: [click here](https://github.com/itsneyoa/skystats/issues)`
                    ].join('\n'),
                    inline: true
                }
            )
            .setColor(getColor(message))
            .setFooter('Made by neyoa ❤')
            .setTimestamp()
        )
	},
};

function getColor(message){
    if(message.channel.type !== 'dm') return message.guild.me.displayHexColor;
    return '1B1D1F'
}