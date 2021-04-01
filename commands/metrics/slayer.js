const Discord = require('discord.js');
const fetch = require('node-fetch');

const loading = `819138970771652609`

module.exports = {
    name: 'slayer',
    aliases: ['slayers', 'maddox'],
    usage: 'slayer [ign] [profile]',
    description: "Gets player slayer information",
    async execute(message, args) {
        if (!args[0]) {
            var ign = message.member.displayName;
        } else {
            if (message.mentions.members.first()) {
                var ign = message.mentions.members.first().displayName;
            }
            else var ign = args[0];
        } // Gets IGN

        var method = 'save';
        if (args[1]) method = args[1];

        ign = ign.replace(/\W/g, ''); // removes weird characters

        message.react(loading);

        fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
            .then(res => {
                if (res.status != 200) {
                    return message.channel.send(
                        new Discord.MessageEmbed()
                            .setDescription(`No Minecraft account found for \`${ign}\``)
                            .setColor('DC143C')
                            .setTimestamp()
                    ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
                }
            }); // Test if IGN esists

        ign = await getTrueIgn(ign);

        // At this point we know its a valid IGN, but not if it has skyblock profiles
        const apiData = await getApiData(ign, method); // Gets all skyblock player data from Senither's Hypixel API Facade

		if (apiData.status != 200) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(apiData.reason)
					.setColor('DC143C')
					.setTimestamp()
			).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
		}

        // IGN is valid and player has skyblock profiles

        return message.channel.send( // EDIT THIS BIT
            new Discord.MessageEmbed()
                .setDescription(`Hi, this command is still being worked on at the moment!`)
                .setColor('FF8C00')
        ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
    },
};

async function getUUID(ign) {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	const result = await response.json();
	return result.id;
}

async function getApiData(ign, method) {
    delete require.cache[require.resolve('../../config.json')];
    const config = require('../../config.json');

    const UUID = await getUUID(ign);
    const response = await fetch(`https://hypixel-api.senither.com/v1/profiles/${UUID}/${method}?key=${config.discord.apiKey}`);
    return await response.json();
}

async function getTrueIgn(ign) {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
    const result = await response.json();
    return result.name;
}

function toFixed(num) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
    return num.toString().match(re)[0];
}