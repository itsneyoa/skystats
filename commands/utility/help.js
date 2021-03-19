const Discord = require('discord.js');

const yes = `819295941621841970`;
const no = `819295822230716467`;

module.exports = {
    name: 'help',
    aliases: ['h', 'info'],
    description: 'Gets information about the bot',
    execute(message, args) {
        delete require.cache[require.resolve('../../package.json')];
        const package = require('../../package.json');

        delete require.cache[require.resolve('../../config.json')];
        const config = require('../../config.json');

        message.author.send(
            new Discord.MessageEmbed()
                .setTitle('SkyStats Help')
                .addFields(
                    {
                        name: "Stats",
                        value: [
                            'Maniacs check: `check [ign]` (`c`)',
                            'Guild check :  `guildcheck [ign]` (`gc`, `gcheck`)',
                            'Player weight:  `weight [ign]` (`we`)',
                            'Player stats: `player [ign]` (`p`, `stats`)'
                        ].join('\n'),
                    },
                    {
                        name: "Utility",
                        value: [
                            'Help: `help` (`h`, `info`)',
                            'Latency: `ping` (`lag`, `latency`)',
                            'Reload: `reload <command>` (`r`, `reboot`)',
                            'Status: `status <type> <message>` (`presence`, `setstatus`)'
                        ].join('\n'),
                    },
                    {
                        name: "Fun",
                        value: [
                            'Hi: `hi` (`hello`)',
                            'Skin: `skin [ign]` (`sk`, skull`, `head`)'
                        ].join('\n'),
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
                ).then(() => {
                    message.react(no);
                })
            });
    },
};