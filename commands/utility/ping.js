const Discord = require('discord.js');

module.exports = {
	name: 'ping',
	aliases: ['lag', 'latency'],
	usage: 'ping',
	description: 'Gets latency of the bot',
	execute(message, args) {
		message.channel.send(
			new Discord.MessageEmbed()
				.setDescription(`Pinging...`)
				.setColor('FF8C00')
		).then(sent => {
			sent.edit(
				new Discord.MessageEmbed()
					.setAuthor(`Pong!`)
					.setDescription([
						`Websocket heartbeat: ${message.client.ws.ping}ms.`,
						`Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`
					].join('\n'))
					.setColor('7CFC00')
			)
		})
	},
};