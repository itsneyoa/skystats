const Discord = require('discord.js');
const config = require('../../config.json');
const package = require('../../package.json');

const yes = `819295941621841970`;
const no = `819295822230716467`;

module.exports = {
	name: 'help',
    aliases: ['h', 'info'],
	description: 'Gets information about the bot',
	execute(message, args) {
		try{
            message.author.send(
                new Discord.MessageEmbed()
                .setTitle('Help!')
                .addFields(
                    {
                        name: "Stats",
                        value: [
                            `Maniacs check: \`check [ign]\``,
                            `Guild check :  \`guildcheck [ign]\``,
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
                .setColor(message.guild.me.displayHexColor)
                .setFooter('Made by neyoa ❤')
                .setTimestamp()
            ).then(message.react(yes))
        } catch {
            message.react(no);
        }
	},
};