const Discord = require('discord.js')
const fs = require('fs');

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = {
    name: 'message',
    async execute(message, client) {
        client.commands = new Discord.Collection();
        const commandFolders = fs.readdirSync('./commands');

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.name, command);
            }
        }

        delete require.cache[require.resolve('../config.json')];
        const config = require('../config.json');

        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(config.discord.prefix)})\\s*`);
        if ((!prefixRegex.test(message.content)) || message.author.bot) return;

        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (message.channel.type === 'dm') return;

        if ((message.author.id != config.discord.ownerId) && command.ownerOnly) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`Sorry, you don't have permission to do this`)
                    .setColor('DC143C')
            ).then(
                discordLog(message.client,
                    new Discord.MessageEmbed()
                        .setAuthor(client.user.username, client.user.avatarURL())
                        .setDescription(`${message.author} tried to use owner-only command \`${message}\``)
                        .setColor('FF8C00')
                        .setTimestamp()
                )
            )
        }

        if ((!(message.member.roles.cache.some(role => role.id == config.discord.modRole))) && command.modOnly) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`Sorry, you don't have permission to do this`)
                    .setColor('DC143C')
            ).then(
                discordLog(message.client,
                    new Discord.MessageEmbed()
                        .setAuthor(client.user.username, client.user.avatarURL())
                        .setDescription(`${message.author} tried to use mod-only command \`${message}\``)
                        .setColor('FF8C00')
                        .setTimestamp()
                )
            )
        }

        if ((message.guild.id != config.discord.mainServer) && command.maniacsOnly) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`Sorry, this command is only available in [Skyblock Maniacs](https://discord.gg/maniacs) Discord.`)
                    .setColor('DC143C')
            )
        }

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`Something went wrong, please try again in a few minutes`)
                    .setColor('DC143C')
            ).then(
                discordLog(message.client,
                    new Discord.MessageEmbed()
                        .setAuthor(client.user.username, client.user.avatarURL())
                        .setDescription(`Error caught: ${message.author} tried to run \`${message}\``)
                        .setColor('DC143C')
                        .setTimestamp()
                )
            )
        }
    },
};

function discordLog(client, embed) {
    delete require.cache[require.resolve('../config.json')];
    const config = require('../config.json');

    client.channels.fetch(config.discord.logChannel)
        .then(channel => channel.send(embed))
        .catch(console.error)
}