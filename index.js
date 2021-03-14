const Discord = require('discord.js');
const chalk = require('chalk');
const fetch = require('node-fetch');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(chalk.greenBright(`Logged in as ${client.user.username}!`));
    client.user.setActivity('Hypixel API.', { type: 'WATCHING' });
  });

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(config.discord.prefix)) return;
  
    const args = message.content.slice(config.discord.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    if (!client.commands.has(command)) return;
    try {
	    client.commands.get(command).execute(message, args);
    } catch (error) {
	    console.error(error);
	    message.reply('Something went wrong, please try again in a few minutes.');
    }
  });
  
  client.login(config.discord.token);