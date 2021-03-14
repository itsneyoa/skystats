const Discord = require('discord.js');
const config = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
	name: 'check',
    aliases: ['c'],
	description: 'Gets metrics about a player',
	execute(message, args) {
        if(message.channel.type === 'dm' && !args[0]){
			return message.channel.send(
				new Discord.MessageEmbed()
				.setDescription(`To use this in DMs you need to specify a player`)
				.setColor('DC143C')
			)
		} else if(!args[0]){
			var ign = message.member.displayName;
		} else {
			var ign = args[0];
		} // Gets IGN

		message.channel.send(`IGN: ${ign}`);

		fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
    	.then(res => {
        	if(res.status != 200){
				return message.channel.send(
					new Discord.MessageEmbed()
					.setDescription(`No Minecraft account found for IGN: \`${ign}\``)
					.setColor('DC143C')
				)
			}
    	}); // Test if IGN esists

	},
};

async function getUUID(ign){
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
    const result = await response.json();
    const uuid = result.id;
    return uuid.substr(0,8)+"-"+uuid.substr(8,4)+"-"+uuid.substr(12,4)+"-"+uuid.substr(16,4)+"-"+uuid.substr(20);
}