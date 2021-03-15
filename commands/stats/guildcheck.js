const Discord = require('discord.js');

module.exports = {
	name: 'guildcheck',
    aliases: ['gc', 'gcheck', 'guild'],
	description: 'Tests if a player meets the requirements for a guild',
	async execute(message, args) {
        message.channel.send(
			new Discord.MessageEmbed()
			.setDescription(`Hi! This command is still being worked on - for now please use \`weight\` or \`check\``)
            .setColor('FFA500')
            .setTimestamp()
		);
	},
};