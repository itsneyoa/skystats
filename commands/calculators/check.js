const Discord = require('discord.js');
const fetch = require('node-fetch');

const yes = `<:yes:819295941621841970>`;
const no = `<:no:819295822230716467>`;
const loading = `819138970771652609`;

module.exports = {
	name: 'check',
	aliases: ['c'],
	usage: 'check [ign] [profile]',
	description: 'Gets if player meets requirements for roles',
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

		if (apiData.data.dungeons == null) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(`\`${ign}\` hasn't entered the catacombs`)
					.setColor('DC143C')
			)
		}

		var returnEmbed = new Discord.MessageEmbed()
			.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
			.addFields(
				{
					name: "Skill Roles",
					value: getSkillRoles(apiData),
					inline: true
				}
			)
			.setFooter(`Profile: ${apiData.data.name}`)
			.setTimestamp()


		if (scammer) {
			returnEmbed.setDescription(`:warning: **This user is a scammer** :warning:`)
			returnEmbed.setColor('FF8C00')
		} else {
			returnEmbed.setColor('7CFC00')
		}

		return message.channel.send(returnEmbed)
			.then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
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

async function getScammerData() {
	const response = await fetch('https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json');
	return await response.json();
}

async function testScammer(ign) {
	let uuid = await getUUID(ign);
	scammerData = await getScammerData();

	if (scammerData.hasOwnProperty(uuid)) return true;
	return false;
}