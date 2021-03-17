const Discord = require('discord.js');
const chalk = require('chalk');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.on("guildCreate", guild => {
  console.log("Joined a new guild: " + guild.name);
})

client.on("guildDelete", guild => {
  console.log("Left a guild: " + guild.name);
})

client.once('ready', () => {
    console.log(chalk.greenBright(`Logged in as ${client.user.username}!`));
});

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(config.discord.prefix)) return;
  
    const args = message.content.slice(config.discord.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
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