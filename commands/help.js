const Discord = require('discord.js');
const config = require('../config.json');
const package = require('../package.json');

module.exports = {
	name: 'help',
    aliases: ['h', 'aaa'],
	description: 'Gets information about the bot',
	execute(message, args) {
		message.channel.send(new Discord.MessageEmbed()
        .setTitle('Help!')
        .addFields(
            {
                name: "Commands",
                value: [
                    `Check player: \`${config.discord.prefix}check [ign] [profile]\``,
                    `Help: \`${config.discord.prefix}help\``
                ].join('\n'),
                inline: true
            },
            {
                name: "Info",
                value: [
                    `Prefix: \`${config.discord.prefix}\``,
                    `Version: \`${package.version}\``
                ].join('\n'),
                inline: true
            }
        )
        .setColor(message.guild.me.displayHexColor)
        .setFooter('Made by neyoa ❤')
        .setTimestamp()
        )
	},
};
