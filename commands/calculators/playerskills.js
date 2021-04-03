const Discord = require('discord.js');
const fetch = require('node-fetch')
const fs = require('fs')
const sleepTime = 500;

const lv60 = 111672425;
const lv50 = 55172425;

const loading = `819138970771652609`;

module.exports = {
    name: 'playerskills',
    aliases: ['psk', 'playersk'],
    usage: 'playerskills [player] [profile]',
    description: 'Gets the skill experience of a player using the maniacs method',
    guildOnly: true,
    maniacsOnly: true,
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

        if (apiData.data.skills.apiEnabled == false) return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
                .setDescription('You currently have skills API disabled, please enable it in the skyblock menu and try again')
                .setColor('DC143C')
                .setTimestamp()
        ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))

        return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
                .setDescription(`Calculated skill exp: \`${calcSkills(apiData).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\``)
                .setColor('7CFC00')
                .setTimestamp()
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

function calcSkills(apiData) { // mining, foraging, farming, combat, fishing, taming
    if (apiData.data.skills.apiEnabled != true) {
        return '-';
    }

    var exp = 0;

    try {
        if (apiData.data.skills.mining.experience >= lv60) exp += lv60;
        else exp += apiData.data.skills.mining.experience
    } catch {
        exp += 0;
    }

    try {
        if (apiData.data.skills.foraging.experience >= lv50) exp += lv50;
        else exp += apiData.data.skills.foraging.experience
    } catch {
        exp += 0;
    }

    try {
        if (apiData.data.skills.farming.experience >= lv60) exp += lv60;
        else exp += apiData.data.skills.farming.experience
    } catch {
        exp += 0;
    }

    try {
        if (apiData.data.skills.combat.experience >= lv60) exp += lv60;
        else exp += apiData.data.skills.combat.experience
    } catch {
        exp += 0;
    }

    try {
        if (apiData.data.skills.fishing.experience >= lv50) exp += lv50;
        else exp += apiData.data.skills.fishing.experience
    } catch {
        exp += 0;
    }

    return Math.floor(exp);
}