const Discord = require('discord.js');

module.exports = {
	name: 'ping',
    aliases: ['lag', 'latency'],
	description: 'Gets latency of the bot',
	execute(message, args) {
		if(message.channel.type !== 'dm'){
			return message.channel.send(
				new Discord.MessageEmbed()
				.setAuthor(`Pong!`)
				.setDescription(`Latency is ${Date.now() - message.createdTimestamp}ms`)
				.setColor(message.guild.me.displayHexColor)
			)
		}
        message.channel.send(
			new Discord.MessageEmbed()
			.setAuthor(`Pong!`)
			.setDescription(`Latency is ${Date.now() - message.createdTimestamp}ms`)
		);
	},
};