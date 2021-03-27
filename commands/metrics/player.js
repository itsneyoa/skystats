const Discord = require('discord.js');
const fetch = require('node-fetch');

const loading = `819138970771652609`

module.exports = {
    name: 'player',
    aliases: ['p', 'stats'],
    usage: 'player [ign] [profile]',
    description: "Gets key player metrics",
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

        return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
                .setDescription(`**${ign}** has the *rank* rank on Hypixel, and is a member of *guildy mcguildface*!`)
                .addFields(
                    {
                        name: `Average Skill Level`,
                        value: toFixed(apiData.data.skills.average_skills),
                        inline: true
                    },
                    {
                        name: `Catacombs Level`,
                        value: toFixed(apiData.data.dungeons.types.catacombs.level),
                        inline: true
                    },
                    {
                        name: `Slayer Experience`,
                        value: (apiData.data.slayers.bosses.revenant.experience + apiData.data.slayers.bosses.tarantula.experience + apiData.data.slayers.bosses.sven.experience).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        inline: true
                    },
                    {
                        name: `Profile Weight`,
                        value: `${toFixed(apiData.data.weight)} + ${toFixed(apiData.data.weight_overflow)} **(${toFixed(apiData.data.weight + apiData.data.weight_overflow)})**`,
                        inline: true
                    },
                    {
                        name: `Coins`,
                        value: toFixed(apiData.data.coins.total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        inline: true
                    }
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