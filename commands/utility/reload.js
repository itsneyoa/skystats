const Discord = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');

module.exports = {
	name: 'reload',
    aliases: ['restart', 'r'],
	description: 'Reloads a command',
	execute(message, args) {
        if (!isOwner(message.author.id)) return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`Sorry, you don't have permission to do this`)
            .setColor('DC143C')
        )

		if (!args.length) return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`You need to specify a command to reload`)
            .setColor('DC143C')
        );
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
	        || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`There is no command with name or alias \`${commandName}\``)
            .setColor('DC143C')
        );

        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`Command \`${command.name}\` successfully reloaded!`)
                .setColor('7CFC00')
            )
        } catch (error) {
            console.error(error);
            return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`Command \`${command.name}\` could not be reloaded.`)
                .setColor('DC143C')
            )   
        }
	},
};

function isOwner(member){
    return member == config.discord.ownerId;
}