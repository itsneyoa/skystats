const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'reload',
    aliases: ['restart', 'r'],
    usage: 'reload <command>',
    description: 'Reloads a command',
    ownerOnly: true,
    execute(message, args) {
        var commandsList = [];

        var reloadSuccess = [];
        var reloadFaliure = [];

        if (!args.length) { // Reload all commands
            const commandFolders = fs.readdirSync('./commands');

            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`../${folder}/${file}`);
                    commandsList.push(command.name)
                }
            }
        }

        else args.forEach(arg => {
            commandsList.push(arg);
        });

        commandsList.forEach(element => {
            const commandName = element.toLowerCase();
            const command = message.client.commands.get(commandName)
                || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`There is no command with name or alias \`${commandName}\``)
                    .setColor('DC143C')
            );

            const commandFolders = fs.readdirSync('./commands');
            var folderName;
            commandFolders.forEach(folder => {
                const commandSubFolders = fs.readdirSync(`./commands/${folder}`);
                commandSubFolders.forEach(cmd => {
                    if (cmd == `${command.name}.js`) folderName = folder;
                });
            });

            delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

            try {
                const newCommand = require(`../${folderName}/${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                reloadSuccess.push(`\`${command.name}\``)
            } catch (error) {
                console.error(error);
                reloadFaliure.push(`\`${command.name}\``)
            }
        });

        if (reloadFaliure.length == 0) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .addField('Reloaded:', reloadSuccess.join('\n'), true)
                    .setColor('7CFC00')
                    .setTimestamp()
            )
        } else if (reloadSuccess.length == 0) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setAuthor('Reload')
                    .addFields('Failed:', reloadFaliure.join('\n'), true)
                    .setColor('DC143C')
                    .setTimestamp()
            )
        } else {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setAuthor('Reload')
                    .addFields(
                        {
                            Name: 'Success:',
                            value: reloadSuccess.join('\n'),
                            inline: true
                        },
                        {
                            Name: 'Failed:',
                            value: reloadFaliure.join('\n'),
                            inline: true
                        }
                    )
                    .setColor('FF8C00')
                    .setTimestamp()
            )
        }
    },
};