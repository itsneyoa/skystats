const Discord = require('discord.js');
const config = require('../../config.json');
const fetch = require('node-fetch');

const yes = `<:yes:819295941621841970>`;
const no = `<:no:819295822230716467>`;
const loading = `819138970771652609`;

module.exports = {
	name: 'check',
	aliases: ['c', 'stats'],
	description: 'Gets metrics about a player',
	async execute(message, args) {
		if (!args[0]) {
			var ign = message.member.displayName;
		} else {
			var ign = args[0];
		} // Gets IGN

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
		const apiData = await getApiData(ign); // Gets all skyblock player data from Senither's Hypixel API Facade

		if (apiData.status == 404) return message.channel.send(
			new Discord.MessageEmbed()
				.setDescription(`No Skyblock profile found for \`${ign}\``)
				.setColor('DC143C')
				.setTimestamp()
		).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))

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
				.setDescription(`**Profile:** ${apiData.data.name}`)
				.addFields(
					{
						name: "Skill Roles",
						value: getSkillRoles(apiData),
						inline: true
					},
					{
						name: "Carriers",
						value: getDungeonRoles(apiData),
						inline: true
					},
				)
				.setColor('7CFC00')
				.setTimestamp()
		).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
	},
};

async function getUUID(ign) {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	const result = await response.json();
	const uuid = result.id;
	return uuid.substr(0, 8) + "-" + uuid.substr(8, 4) + "-" + uuid.substr(12, 4) + "-" + uuid.substr(16, 4) + "-" + uuid.substr(20);
}

async function getApiData(ign) {
	const UUID = await getUUID(ign);
	const response = await fetch(`https://hypixel-api.senither.com/v1/profiles/${UUID}/save?key=${config.discord.apiKey}`);
	return await response.json();
}

async function getTrueIgn(ign) {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	const result = await response.json();
	return result.name;
}

function getSkillRoles(apiData) {
	var taming = apiData.data.skills.taming.level == config.requirements.roles.skills.taming;
	var alchemy = apiData.data.skills.alchemy.level == config.requirements.roles.skills.alchemy;
	if (taming) taming = yes; else taming = no;
	if (alchemy) alchemy = yes; else alchemy = no;
	return [
		`Levellers:	${taming}`,
		`Brewers:	${alchemy}`
	].join('\n');
}

function getDungeonRoles(apiData) {
	var f4 = apiData.data.dungeons.types.catacombs.level >= config.requirements.roles.dungeons.f4;
	var f5 = apiData.data.dungeons.types.catacombs.level >= config.requirements.roles.dungeons.f5;
	var f6 = apiData.data.dungeons.types.catacombs.level >= config.requirements.roles.dungeons.f6;
	var f7 = apiData.data.dungeons.types.catacombs.level >= config.requirements.roles.dungeons.f7;
	if (f4) f4 = yes; else f4 = no;
	if (f5) f5 = yes; else f5 = no;
	if (f6) f6 = yes; else f6 = no;
	if (f7) f7 = yes; else f7 = no;
	return [
		`Floor 4:	${f4}`,
		`Floor 5:	${f5}`,
		`Floor 6:	${f6}`,
		`Floor 7:	${f7}`
	].join('\n')
}