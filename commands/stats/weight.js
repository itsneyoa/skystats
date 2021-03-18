const Discord = require('discord.js');
const config = require('../../config.json')
const fetch = require('node-fetch');

const loading = `819138970771652609`

module.exports = {
    name: 'weight',
    aliases: ['we'],
    description: "Gets the weight of a player's profile",
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
                .setColor('7CFC00')
                .setDescription(`${ign}'s weights for their **${apiData.data.name}** profile are **${(apiData.data.weight).toString().substr(0, 7)} + ${(apiData.data.weight_overflow).toString().substr(0, 5)} Overflow (${(apiData.data.weight + apiData.data.weight_overflow).toString().substr(0, 7)} Total)**`)
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
                            toFixed(apiData.data.skills.mining.weight + apiData.data.skills.mining.weight_overflow),
                            toFixed(apiData.data.skills.foraging.weight + apiData.data.skills.foraging.weight_overflow),
                            toFixed(apiData.data.skills.enchanting.weight + apiData.data.skills.enchanting.weight_overflow),
                            toFixed(apiData.data.skills.farming.weight + apiData.data.skills.farming.weight_overflow),
                            toFixed(apiData.data.skills.combat.weight + apiData.data.skills.combat.weight_overflow),
                            toFixed(apiData.data.skills.fishing.weight + apiData.data.skills.fishing.weight_overflow),
                            toFixed(apiData.data.skills.alchemy.weight + apiData.data.skills.alchemy.weight_overflow),
                            toFixed(apiData.data.skills.taming.weight + apiData.data.skills.taming.weight_overflow)
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: 'Slayer + Dungeon weights',
                        value: 'There are still being developed in the new format, please be patient'
                    }
                )
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

function toFixed(num) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
    return num.toString().match(re)[0];
}