const Discord = require('discord.js');
const config = require('../../config.json')
const fetch = require('node-fetch');

const loading = `819138970771652609`

module.exports = {
    name: 'weight',
    aliases: ['we'],
    description: "Gets the weight of a player's profile",
    async execute(message, args) {
        if (message.channel.type === 'dm' && !args[0]) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`To use this in DMs you need to specify a player`)
                    .setColor('DC143C')
                    .setTimestamp()
            )
        } else if (!args[0]) {
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
                        name: `Skills Weight: ${(apiData.data.skills.weight).toString().substr(0, 6)} + ${(apiData.data.skills.weight_overflow).toString().substr(0, 5)} Overflow (${(apiData.data.skills.weight + apiData.data.skills.weight_overflow).toString().substr(0, 6)} Total)`,
                        value: '```ruby\n' + [
                            `Mining     > Lvl: ${(apiData.data.skills.mining.level).toString().substr(0, 5)}     Weight: ${(apiData.data.skills.mining.weight).toString().substr(0, 5)}`,
                            `Foraging   > Lvl: ${(apiData.data.skills.foraging.level).toString().substr(0, 5)}   Weight: ${(apiData.data.skills.foraging.weight).toString().substr(0, 5)}`,
                            `Enchanting > Lvl: ${(apiData.data.skills.enchanting.level).toString().substr(0, 5)} Weight: ${(apiData.data.skills.enchanting.weight).toString().substr(0, 5)}`,
                            `Farming    > Lvl: ${(apiData.data.skills.farming.level).toString().substr(0, 5)}    Weight: ${(apiData.data.skills.farming.weight).toString().substr(0, 5)}`,
                            `Combat     > Lvl: ${(apiData.data.skills.combat.level).toString().substr(0, 5)}     Weight: ${(apiData.data.skills.combat.weight).toString().substr(0, 5)}`,
                            `Fishing    > Lvl: ${(apiData.data.skills.fishing.level).toString().substr(0, 5)}    Weight: ${(apiData.data.skills.fishing.weight).toString().substr(0, 5)}`,
                            `Alchemy    > Lvl: ${(apiData.data.skills.alchemy.level).toString().substr(0, 5)}    Weight: ${(apiData.data.skills.alchemy.weight).toString().substr(0, 5)}`,
                            `Taming     > Lvl: ${(apiData.data.skills.taming.level).toString().substr(0, 5)}     Weight: ${(apiData.data.skills.taming.weight).toString().substr(0, 5)}`
                        ].join('\n') + '\n```'
                    },
                    {
                        name: `Slayer Weight: ${(apiData.data.slayers.weight).toString().substr(0, 6)} + ${(apiData.data.slayers.weight_overflow).toString().substr(0, 5)} Overflow (${(apiData.data.slayers.weight + apiData.data.slayers.weight_overflow).toString().substr(0, 6)} Total)`,
                        value: '```ruby\n' + [
                            `Revenant   > Exp: ${(apiData.data.slayers.bosses.revenant.experience).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}      Weight: ${(apiData.data.slayers.bosses.revenant.weight).toString().substr(0, 5)}`,
                            `Tarantula  > Exp: ${(apiData.data.slayers.bosses.tarantula.experience).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}     Weight: ${(apiData.data.slayers.bosses.tarantula.weight).toString().substr(0, 5)}`,
                            `Sven       > Exp: ${(apiData.data.slayers.bosses.sven.experience).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}          Weight: ${(apiData.data.slayers.bosses.sven.weight).toString().substr(0, 5)}`
                        ].join('\n') + '\n```'
                    },
                    {
                        name: `Dungeon Weight: ${(apiData.data.dungeons.weight).toString().substr(0, 6)} + ${(apiData.data.dungeons.weight_overflow).toString().substr(0, 5)} Overflow (${(apiData.data.dungeons.weight + apiData.data.dungeons.weight_overflow).toString().substr(0, 6)} Total)`,
                        value: '```ruby\n' + [
                            `Catabombs  > Lvl: ${(apiData.data.dungeons.types.catacombs.level).toString().substr(0, 5)}          Weight: ${(apiData.data.dungeons.types.catacombs.weight).toString().substr(0, 5)}`,
                            `Healer     > Lvl: ${(apiData.data.dungeons.classes.healer.level).toString().substr(0, 5)}           Weight: ${(apiData.data.dungeons.classes.healer.weight).toString().substr(0, 5)}`,
                            `Mage       > Lvl: ${(apiData.data.dungeons.classes.mage.level).toString().substr(0, 5)}             Weight: ${(apiData.data.dungeons.classes.mage.weight).toString().substr(0, 5)}`,
                            `Berserker  > Lvl: ${(apiData.data.dungeons.classes.berserker.level).toString().substr(0, 5)}        Weight: ${(apiData.data.dungeons.classes.berserker.weight).toString().substr(0, 5)}`,
                            `Archer     > Lvl: ${(apiData.data.dungeons.classes.archer.level).toString().substr(0, 5)}           Weight: ${(apiData.data.dungeons.classes.archer.weight).toString().substr(0, 5)}`,
                            `Tank       > Lvl: ${(apiData.data.dungeons.classes.tank.level).toString().substr(0, 5)}             Weight: ${(apiData.data.dungeons.classes.tank.weight).toString().substr(0, 5)}`
                        ].join('\n') + '\n```'
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