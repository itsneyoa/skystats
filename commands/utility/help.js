const Discord = require('discord.js');
const fs = require('fs')

const yes = `819295941621841970`;
const no = `819295822230716467`;

module.exports = {
    name: 'help',
    aliases: ['h', 'info', `commands`],
    description: 'Gets information about the bot',
    guildOnly: true,
    execute(message, args) {
        delete require.cache[require.resolve('../../package.json')];
        const package = require('../../package.json');

        delete require.cache[require.resolve('../../config.json')];
        const config = require('../../config.json');

        const commandFolders = fs.readdirSync('./commands');

        if (!args.length) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`Help - ${message.client.user.username}`)
                .setColor(message.guild.me.displayHexColor)
                .setFooter('Made by neyoa ❤')
                .setTimestamp();

            for (const folder of commandFolders) {
                let data = [];
                const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`../${folder}/${file}`);
                    let currentCommand = [];
                    currentCommand.push(`\`${command.name.charAt(0).toUpperCase() + command.name.slice(1)}\``);
                    currentCommand.push('-');
                    currentCommand.push(command.description);
                    data.push(currentCommand.join(' '));
                }
                embed.addField((folder.charAt(0).toUpperCase() + folder.slice(1)), data.join('\n'))
            }

            embed.addField('Info', [
                `Prefix: \`${config.discord.prefix}\``,
                `Version: \`${package.version}\``,
                `Issues: [click here](https://github.com/itsneyoa/skystats/issues)`,
                `Server: \`${message.guild.name}\``,
                `Channel: ${message.channel}`
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
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);

        message.channel.send(data, { split: true });


    },
};