const Discord = require('discord.js');
const fetch = require('node-fetch');

const yes = `<:yes:819295941621841970>`;
const no = `<:no:819295822230716467>`;
const loading = `819138970771652609`;

module.exports = {
	name: 'guildcheck',
	aliases: ['gc', 'gcheck', 'guild'],
	usage: 'guildcheck [ign] [profile]',
	description: 'Tests if a player meets the requirements for a guild',
	maniacsOnly: true,
	async execute(message, args) {
		delete require.cache[require.resolve('../../config.json')];
		const config = require('../../config.json');

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
			return message.channel.send(
				new Discord.MessageEmbed()
					.setDescription(`No Skyblock profile found for \`${ign}\``)
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

		if (scammer) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setTitle(`Denied.`)
					.setColor(`FF8C00`)
					.setFooter(`Weight: ${toFixed(apiData.data.weight + apiData.data.weight_overflow)}`)
					.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `http://sky.shiiyu.moe/stats/${ign}`)
					.setDescription(`\`${ign}\` is on the scammers list`)
					.setTimestamp()
			).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
		} else if ((apiData.data.weight + apiData.data.weight_overflow) >= config.requirements.guild.weight) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setTitle(`Accepted!`)
					.setColor(`32CD32`)
					.setDescription([
						`You meet the requirements to join the guild!`,
						`Before we invite you please make sure you:`,
						`- Aren't currently in a guild`,
						`- Have guild invites privacy settings on low`,
						`- Are able to accept the invite`
					].join('\n'))
					.addField('Roles:', [
						`Dungeoneer: 	${getEmoji(apiData.data.dungeons.types.catacombs.level > config.requirements.guild.ranks.catacombs)}`,
						`Skill Grinder:	${getEmoji(apiData.data.skills.average_skills > config.requirements.guild.ranks.skills)}`
					].join('\n'))
					.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `http://sky.shiiyu.moe/stats/${ign}`)
					.setFooter(`Your Weight: ${toFixed(apiData.data.weight + apiData.data.weight_overflow)}`)
					.setTimestamp()
			).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
		} else {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setTitle(`Denied.`)
					.setColor(`DC143C`)
					.setFooter(`If you think this is wrong we'll check manually for you`)
					.setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `http://sky.shiiyu.moe/stats/${ign}`)
					.setDescription(`Sorry but you don't currently have ${config.requirements.guild.weight} weight.`)
					.addField("Your weight:", toFixed(apiData.data.weight + apiData.data.weight_overflow))
					.setTimestamp()
			).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
		}
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

function getEmoji(input) {
	if (input === true) return yes;
	else return no;
}

function toFixed(num) {
	var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
	return num.toString().match(re)[0];
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