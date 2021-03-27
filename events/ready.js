const Discord = require('discord.js')
const chalk = require('chalk');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(chalk.greenBright(`Logged in as ${client.user.username}!`));
		discordLog(client,
			new Discord.MessageEmbed()
				.setAuthor(client.user.username, client.user.avatarURL())
				.setDescription('Logged in to discord!')
				.setColor('7CFC00')
				.setTimestamp()
		)
	},
};

function discordLog(client, embed) {
	delete require.cache[require.resolve('../config.json')];
	const config = require('../config.json');

	client.channels.fetch(config.discord.logChannel)
		.then(channel => channel.send(embed))
		.catch(console.error)
}