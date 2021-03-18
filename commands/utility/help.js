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
        message.author.send(
            new Discord.MessageEmbed()
                .setTitle('SkyStats Help')
                .addFields(
                    {
                        name: "Stats",
                        value: [
                            `Maniacs check: \`check [ign]\``,
                            `Guild check :  \`guildcheck [ign]\``,
                            `Player weight:  \`weight [ign]\``,
                            `Player stats: \`player [ign]\``
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
                            `Issues: [click here](https://github.com/itsneyoa/skystats/issues)`,
                            `Server: \`${message.guild.name}\``,
                            `Channel: ${message.channel}`
                        ].join('\n')
                    }
                )
                .setColor(message.guild.me.displayHexColor)
                .setFooter('Made by neyoa ❤')
                .setTimestamp()
        ).then(() => {
            message.react(yes);
        })
        .catch(() => {
            message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${message.author}, I can't DM you! Make sure you have DMs enabled!`)
                .setColor('DC143C')
            )
        });
    },
};