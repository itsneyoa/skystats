const Discord = require('discord.js');

module.exports = {
	name: 'ping',
    aliases: ['lag', 'latency'],
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

function getColor(message){
    if(message.channel.type !== 'dm') return message.guild.me.displayHexColor;
    return '1B1D1F'
}