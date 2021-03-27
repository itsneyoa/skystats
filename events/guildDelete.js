const Discord = require('discord.js')
const chalk = require('chalk');

module.exports = {
	name: 'guildDelete',
	execute(guild, client) {
		console.log(chalk.red(`Left a Guild: ${guild.name}`));
		discordLog(client,
			new Discord.MessageEmbed()
				.setAuthor(client.user.username, client.user.avatarURL())
				.setDescription(`Left a Guild: \`${guild.name}\``)
				.setColor('DC143C')
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