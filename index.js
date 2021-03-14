const Discord = require('discord.js');
const chalk = require('chalk');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}


client.once('ready', () => {
    console.log(chalk.greenBright(`Logged in as ${client.user.username}!`));
    client.user.setActivity('Hypixel API.', { type: 'WATCHING' });
  });

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(config.discord.prefix)) return;
  
    const args = message.content.slice(config.discord.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
	    command.execute(message, args);
    } catch (error) {
	    console.error(error);
	    message.reply('Something went wrong, please try again in a few minutes.');
    }
  });
  
  client.login(config.discord.token);