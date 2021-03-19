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
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Help - ${message.client.user.username}`)
            
            for (const folder of commandFolders) {
                let data = [];
                const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`../${folder}/${file}`);
                    let currentCommand = [];
                    currentCommand.push(command.name);
                    currentCommand.push('-');
                    currentCommand.push(command.description);
                    data.push(currentCommand.join(' '));
                }
                embed.addField((folder.charAt(0).toUpperCase() + folder.slice(1)), data.join('\n'))
            }

            return message.author.send(embed)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
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