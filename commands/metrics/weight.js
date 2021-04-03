const Discord = require('discord.js');
const fetch = require('node-fetch');

const loading = `819138970771652609`

module.exports = {
    name: 'weight',
    aliases: ['we'],
    usage: 'weight [ign] [profile]',
    description: "Gets the weight of a player's profile. This is a number generated from your Skills, Slayers and Dungeons levels.",
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

        if (apiData.data.dungeons == null) return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
                .setDescription(`${ign} has not entered the catacombs`)
                .setColor('DC143C')
                .setTimestamp()
        ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))

        return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
                .setColor('7CFC00')
                .setDescription(`${ign}'s weights for their **${apiData.data.name}** profile are **${toFixed(apiData.data.weight)} + ${toFixed(apiData.data.weight_overflow)} Overflow (${toFixed(apiData.data.weight + apiData.data.weight_overflow)} Total)**`)
                .addFields(
                    {
                        name: 'Skills',
                        value: [
                            `Mining:`,
                            `Foraging:`,
                            `Enchanting:`,
                            `Farming:`,
                            `Combat:`,
                            `Fishing:`,
                            `Alchemy:`,
                            `Taming:`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: 'Level',
                        value: [
                            toFixed(apiData.data.skills.mining.level),
                            toFixed(apiData.data.skills.foraging.level),
                            toFixed(apiData.data.skills.enchanting.level),
                            toFixed(apiData.data.skills.farming.level),
                            toFixed(apiData.data.skills.combat.level),
                            toFixed(apiData.data.skills.fishing.level),
                            toFixed(apiData.data.skills.alchemy.level),
                            toFixed(apiData.data.skills.taming.level)
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: 'Weight',
                        value: [
                            `**${toFixed(apiData.data.skills.mining.weight)}** + ${toFixed(apiData.data.skills.mining.weight_overflow)} *(${toFixed(apiData.data.skills.mining.weight + apiData.data.skills.mining.weight_overflow)})*`,
                            `**${toFixed(apiData.data.skills.foraging.weight)}** + ${toFixed(apiData.data.skills.foraging.weight_overflow)} *(${toFixed(apiData.data.skills.foraging.weight + apiData.data.skills.foraging.weight_overflow)})*`,
                            `**${toFixed(apiData.data.skills.enchanting.weight)}** + ${toFixed(apiData.data.skills.enchanting.weight_overflow)} *(${toFixed(apiData.data.skills.enchanting.weight + apiData.data.skills.enchanting.weight_overflow)})*`,
                            `**${toFixed(apiData.data.skills.farming.weight)}** + ${toFixed(apiData.data.skills.farming.weight_overflow)} *(${toFixed(apiData.data.skills.farming.weight + apiData.data.skills.farming.weight_overflow)})*`,
                            `**${toFixed(apiData.data.skills.combat.weight)}** + ${toFixed(apiData.data.skills.combat.weight_overflow)} *(${toFixed(apiData.data.skills.combat.weight + apiData.data.skills.combat.weight_overflow)})*`,
                            `**${toFixed(apiData.data.skills.fishing.weight)}** + ${toFixed(apiData.data.skills.fishing.weight_overflow)} *(${toFixed(apiData.data.skills.fishing.weight + apiData.data.skills.fishing.weight_overflow)})*`,
                            `**${toFixed(apiData.data.skills.alchemy.weight)}** + ${toFixed(apiData.data.skills.alchemy.weight_overflow)} *(${toFixed(apiData.data.skills.alchemy.weight + apiData.data.skills.alchemy.weight_overflow)})*`,
                            `**${toFixed(apiData.data.skills.taming.weight)}** + ${toFixed(apiData.data.skills.taming.weight_overflow)} *(${toFixed(apiData.data.skills.taming.weight + apiData.data.skills.taming.weight_overflow)})*`
                        ].join('\n'),
                        inline: true
                    },

                    {
                        name: 'Slayer',
                        value: [
                            `Revenant Horror:`,
                            `Tarantula Broodfather:`,
                            `Sven Packmaster:`,
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: 'Experience',
                        value: [
                            (apiData.data.slayers.bosses.revenant.experience).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            (apiData.data.slayers.bosses.tarantula.experience).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            (apiData.data.slayers.bosses.sven.experience).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: 'Weight',
                        value: [
                            `**${toFixed(apiData.data.slayers.bosses.revenant.weight)}** + ${toFixed(apiData.data.slayers.bosses.revenant.weight_overflow)} *(${toFixed(apiData.data.slayers.bosses.revenant.weight + apiData.data.slayers.bosses.revenant.weight_overflow)})*`,
                            `**${toFixed(apiData.data.slayers.bosses.tarantula.weight)}** + ${toFixed(apiData.data.slayers.bosses.tarantula.weight_overflow)} *(${toFixed(apiData.data.slayers.bosses.tarantula.weight + apiData.data.slayers.bosses.tarantula.weight_overflow)})*`,
                            `**${toFixed(apiData.data.slayers.bosses.sven.weight)}** + ${toFixed(apiData.data.slayers.bosses.sven.weight_overflow)} *(${toFixed(apiData.data.slayers.bosses.sven.weight + apiData.data.slayers.bosses.sven.weight_overflow)})*`
                        ].join('\n'),
                        inline: true
                    },

                    {
                        name: 'Dungeons',
                        value: [
                            `Catacombs:`,
                            `Healer:`,
                            `Mage:`,
                            `Berserker:`,
                            `Archer:`,
                            `Tank:`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: 'Level',
                        value: [
                            toFixed(apiData.data.dungeons.types.catacombs.level),
                            toFixed(apiData.data.dungeons.classes.healer.level),
                            toFixed(apiData.data.dungeons.classes.mage.level),
                            toFixed(apiData.data.dungeons.classes.berserker.level),
                            toFixed(apiData.data.dungeons.classes.archer.level),
                            toFixed(apiData.data.dungeons.classes.tank.level)
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: 'Weight',
                        value: [
                            `**${toFixed(apiData.data.dungeons.types.catacombs.weight)}** + ${toFixed(apiData.data.dungeons.types.catacombs.weight_overflow)} *(${toFixed(apiData.data.dungeons.types.catacombs.weight + apiData.data.dungeons.types.catacombs.weight_overflow)})*`,
                            `**${toFixed(apiData.data.dungeons.classes.healer.weight)}** + ${toFixed(apiData.data.dungeons.classes.healer.weight_overflow)} *(${toFixed(apiData.data.dungeons.classes.healer.weight + apiData.data.dungeons.classes.healer.weight_overflow)})*`,
                            `**${toFixed(apiData.data.dungeons.classes.mage.weight)}** + ${toFixed(apiData.data.dungeons.classes.mage.weight_overflow)} *(${toFixed(apiData.data.dungeons.classes.mage.weight + apiData.data.dungeons.classes.mage.weight_overflow)})*`,
                            `**${toFixed(apiData.data.dungeons.classes.berserker.weight)}** + ${toFixed(apiData.data.dungeons.classes.berserker.weight_overflow)} *(${toFixed(apiData.data.dungeons.classes.berserker.weight + apiData.data.dungeons.classes.berserker.weight_overflow)})*`,
                            `**${toFixed(apiData.data.dungeons.classes.archer.weight)}** + ${toFixed(apiData.data.dungeons.classes.archer.weight_overflow)} *(${toFixed(apiData.data.dungeons.classes.archer.weight + apiData.data.dungeons.classes.archer.weight_overflow)})*`,
                            `**${toFixed(apiData.data.dungeons.classes.tank.weight)}** + ${toFixed(apiData.data.dungeons.classes.tank.weight_overflow)} *(${toFixed(apiData.data.dungeons.classes.tank.weight + apiData.data.dungeons.classes.tank.weight_overflow)})*`,
                        ].join('\n'),
                        inline: true
                    },
                )
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

function toFixed(num) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
    return num.toString().match(re)[0];
}