const Discord = require('discord.js');
const fs = require('fs')

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
                }
                embed.addField((folder.charAt(0).toUpperCase() + folder.slice(1)), descriptions.join('\n'))
            }

            embed.addField('Info', [
                `Prefix: \`${config.discord.prefix}\``,
                `Version: \`${package.version}\``,
                `Issues: [click here](https://github.com/itsneyoa/skystats/issues)`,
                `Server: \`${message.guild.name}\``,
                `Channel: ${message.channel}`,
                `Discord: [click here](https://discord.neyoa.me)`
            ].join('\n'))

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

        let embed = new Discord.MessageEmbed()
                .setAuthor(`Help - ${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`, message.client.user.avatarURL())
                .setColor(message.guild.me.displayHexColor)
                .setFooter('Made by neyoa ❤')
                .setTimestamp();

        embed.setDescription([
            `*${command.description}*`,
            `Usage: \`${command.usage}\``
        ])
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