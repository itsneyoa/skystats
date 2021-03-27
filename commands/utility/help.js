const Discord = require('discord.js');
const fs = require('fs');

const yes = `819295941621841970`;
const no = `819295822230716467`;

module.exports = {
    name: 'help',
    aliases: ['h', 'info', `commands`],
    usage: 'help [command]',
    description: 'Gets information about the bot',
    execute(message, args) {
        if (!args.length) {
            delete require.cache[require.resolve('../../package.json')];
            const package = require('../../package.json');

            delete require.cache[require.resolve('../../config.json')];
            const config = require('../../config.json');

            const commandFolders = fs.readdirSync('./commands');

            let embed = new Discord.MessageEmbed()
                .setAuthor(`Help - ${message.client.user.username}`, message.client.user.avatarURL())
                .setDescription(`For more information run \`help [command]\``)
                .setColor(message.guild.me.displayHexColor)
                .setFooter('Made by neyoa ❤')
                .setTimestamp();

            var commandsNum = 0;

            for (const folder of commandFolders) {
                let descriptions = [];
                const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`../${folder}/${file}`);
                    let currentCommand = [];
                    currentCommand.push(`\`${command.name.charAt(0).toUpperCase() + command.name.slice(1)}\``);
                    currentCommand.push('-');
                    currentCommand.push(command.description);
                    descriptions.push(currentCommand.join(' '));
                    commandsNum++;
                }
                embed.addField((folder.charAt(0).toUpperCase() + folder.slice(1)), descriptions.join('\n'))
            }

            embed.addField('Info', [
                `Prefix: \`${config.discord.prefix}\``,
                `Issues: [click here](https://github.com/itsneyoa/skystats/issues)`,
                `Server: \`${message.guild.name}\``,
                `Channel: ${message.channel}`,
                `Discord: [click here](https://discord.neyoa.me)`
            ].join('\n'), true)

            embed.addField('Stats', [
                `Unique users: \`${message.client.users.cache.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\``,
                `Servers: \`${message.client.guilds.cache.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\``,
                `Version: \`${package.version}\``,
                `Uptime: \`${timeConversion(message.client.uptime)}\``,
                `Commands: \`${commandsNum}\``
            ].join('\n'), true)

            return message.author.send(embed)
                .then(() => {
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
        } // all commands

        const name = args[0].toLowerCase();
        const command = message.client.commands.get(name) || message.client.commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`\`${name}\` isn't a valid command`)
                    .setColor('DC143C')
            );
        }

        if (command.ownerOnly && !isOwner(message.author.id)) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`This command is owner only!`)
                    .setColor('DC143C')
            );
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor(`Help - ${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`, message.client.user.avatarURL())
            .setColor(message.guild.me.displayHexColor)
            .setFooter('Made by neyoa ❤')
            .setTimestamp();

        var desc = [`*${command.description}*`, `Usage: \`${command.usage}\``];

        if (command.maniacsOnly) desc.push(`Maniacs Only: <:yes:${yes}>`);
        else desc.push(`Maniacs Only: <:no:${no}>`);

        embed.setDescription(desc.join('\n'))
        embed.addField('Aliases', `\`${command.aliases.join('\n')}\``, true)

        return message.author.send(embed)
            .then(() => {
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
            }); // individual commands
    },
};

function timeConversion(millisec) {
    var seconds = (millisec / 1000).toFixed(0);

    var minutes = (millisec / (1000 * 60)).toFixed(0);

    var hours = (millisec / (1000 * 60 * 60)).toFixed(0);

    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0);

    var weeks = (millisec / (1000 * 60 * 60 * 24 * 7)).toFixed(0);

    if (seconds < 60) {
        return seconds + " Seconds";
    } else if (minutes < 60) {
        return minutes + " Minutes";
    } else if (hours < 24) {
        return hours + " Hours";
    } else if (days > 7) {
        return days + " Days"
    } else {
        return weeks + " Weeks"
    }
}

function isOwner(id) {
    delete require.cache[require.resolve('../../config.json')];
    const config = require('../../config.json');

    return id == config.discord.ownerId;
}