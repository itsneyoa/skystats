const Discord = require('discord.js');
const fetch = require('node-fetch');

const yes = `<:yes:819295941621841970>`;
const no = `<:no:819295822230716467>`;
const loading = `819138970771652609`;

module.exports = {
	name: 'check',
	aliases: ['c'],
	usage: 'check [ign] [profile]',
	description: 'Gets if player meets certain role requirements',
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

		var scammer = await testScammer(ign);

		// At this point we know its a valid IGN, but not if it has skyblock profiles
		const apiData = await getApiData(ign, method); // Gets all skyblock player data from Senither's Hypixel API Facade

		if (apiData.status == 404) {
			if (apiData.reason == 'Failed to find a profile using the given strategy') {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setDescription(`Profile \`${method}\` not found for \`${ign}\``)
						.setColor('DC143C')
						.setTimestamp()
				).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
			} else {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setDescription(`No Skyblock profile found for \`${ign}\``)
						.setColor('DC143C')
						.setTimestamp()
				).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
			}
		}

		// IGN is valid and player has skyblock profiles

		if (apiData.data.skills.apiEnabled == false) return message.channel.send(
			new Discord.MessageEmbed()
				.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
				.setDescription('You currently have skills API disabled, please enable it in the skyblock menu and try again')
				.setColor('DC143C')
				.setTimestamp()
		).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))

		if (apiData.data.dungeons == null) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(`\`${ign}\` hasn't entered the catacombs`)
					.setColor('DC143C')
			)
		}

		if (scammer) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
					.setDescription(`:warning: **This user is a scammer** :warning:`)
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
						{
							name: "Other",
							value: await getOtherStuff(apiData),
							inline: true
						}
					)
					.setColor('FF8C00')
					.setFooter(`Profile: ${apiData.data.name}`)
					.setTimestamp()
			).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
		}

		return message.channel.send(
			new Discord.MessageEmbed()
				.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
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
					{
						name: "Other",
						value: await getOtherStuff(apiData),
						inline: true
					}
				)
				.setColor('7CFC00')
				.setFooter(`Profile: ${apiData.data.name}`)
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

function getSkillRoles(apiData) {
	delete require.cache[require.resolve('../../config.json')];
	const config = require('../../config.json');

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
	delete require.cache[require.resolve('../../config.json')];
	const config = require('../../config.json');

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
		`Floor 7:	${f7}`,
	].join('\n')
}

async function getScammerData() {
	const response = await fetch('https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json');
	return await response.json();
}

async function testScammer(ign) {
	let uuidClean = await getUUID(ign);
	uuidClean = uuidClean.replace(/-/g, "")

	scammerData = await getScammerData();

	if (scammerData.hasOwnProperty(uuidClean)) return true;
	return false;
}

async function getOtherStuff(apiData) {
	var f7splustime;
	try {
		f7splustime = formatTime(apiData.data.dungeons.types.catacombs.fastest_time_s_plus.tier_7.seconds);
	} catch {
		f7splustime = `N/A`;
	}

	return [
		`Secrets: \`${apiData.data.dungeons.secrets_found.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\``,
		`Best F7 S+: \`${f7splustime}\``
	].join('\n')
}

function formatTime(time) {
	// Hours, minutes and seconds
	var hrs = ~~(time / 3600);
	var mins = ~~((time % 3600) / 60);
	var secs = ~~time % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	var ret = "";
	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}
	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;
	return ret;
}