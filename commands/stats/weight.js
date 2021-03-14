const Discord = require('discord.js');
const config = require('../../config.json');
const fetch = require('node-fetch');

module.exports = {
    name: 'weight',
    aliases: ['we'],
    description: "Gets the weight of a player's profile",
    async execute(message, args) {
        const apiData = await getApiData(ign);

        if (message.channel.type === 'dm' && !args[0]) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`To use this in DMs you need to specify a player`)
                    .setColor('DC143C')
            )
        } else if (!args[0]) {
            var ign = message.member.displayName;
        } else {
            var ign = args[0];
        } // Gets IGN

        message.react(loading);

        fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
            .then(res => {
                if (res.status != 200) {
                    return message.channel.send(
                        new Discord.MessageEmbed()
                            .setDescription(`No Minecraft account found for \`${ign}\``)
                            .setColor('DC143C')
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
        ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))

        // IGN is valid and player has skyblock profiles

        if (apiData.data.skills.apiEnabled == false) return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
                .setDescription('You currently have skills API disabled, please enable it in the skyblock menu and try again')
                .setColor('DC143C')
        ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))

        return message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(ign, `https://cravatar.eu/helmavatar/${ign}/600.png`, `https://sky.shiiyu.moe/stats/${ign}`)
                .setColor('69e0a5')
                .setDescription(`${ign}'s weights for their **${apiData.data.name}** profile are **${roundNumber(apiData.data.weight)} + ${roundNumber(apiData.data.weight_overflow)} Overflow (${roundNumber(apiData.data.weight) + roundNumber(apiData.data.weight_overflow)} Total)**`)
                .addFields(
                    {
                        name: `Skills Weight: ${roundNumber(apiData.data.skills.weight)} + ${roundNumber(apiData.data.skills.weight_overflow)} Overflow (${roundNumber(apiData.data.skills.weight) + roundNumber(apiData.data.skills.weight_overflow)} Total)`,
                        value: '```ruby\n' + [
                            `Mining     > Lvl: ${roundNumber(apiData.data.skills.mining.level)}     Weight: ${roundNumber(apiData.data.skills.mining.weight)}`,
                            `Foraging   > Lvl: ${roundNumber(apiData.data.skills.foraging.level)}     Weight: ${roundNumber(apiData.data.skills.foraging.weight)}`,
                            `Enchanting > Lvl: ${roundNumber(apiData.data.skills.enchanting.level)} Weight: ${roundNumber(apiData.data.skills.enchanting.weight)}`,
                            `Farming    > Lvl: ${roundNumber(apiData.data.skills.farming.level)}    Weight: ${roundNumber(apiData.data.skills.farming.weight)}`,
                            `Combat     > Lvl: ${roundNumber(apiData.data.skills.combat.level)}     Weight: ${roundNumber(apiData.data.skills.combat.weight)}`,
                            `Fishing    > Lvl: ${roundNumber(apiData.data.skills.fishing.level)}    Weight: ${roundNumber(apiData.data.skills.fishing.weight)}`,
                            `Alchemy    > Lvl: ${roundNumber(apiData.data.skills.alchemy.level)}    Weight: ${roundNumber(apiData.data.skills.alchemy.weight)}`,
                            `Taming     > Lvl: ${roundNumber(apiData.data.skills.taming.level)}     Weight: ${roundNumber(apiData.data.skills.taming.weight)}`
                        ].join('\n') + '\n```'
                    },
                    {
                        name: `Slayer Weight: ${roundNumber(apiData.data.slayers.weight)} + ${roundNumber(apiData.data.slayers.weight_overflow)} Overflow (${roundNumber(apiData.data.slayers.weight) + roundNumber(apiData.data.slayers.weight_overflow)} Total)`,
                        value: '```ruby\n' + [
                            `Revenant   > Exp: ${roundNumber(apiData.data.slayers.bosses.revenant.experience)}      Weight: ${roundNumber(apiData.data.slayers.bosses.revenant.weight)}`,
                            `Tarantula  > Exp: ${roundNumber(apiData.data.slayers.bosses.tarantula.experience)}     Weight: ${roundNumber(apiData.data.slayers.bosses.tarantula.weight)}`,
                            `Sven       > Exp: ${roundNumber(apiData.data.slayers.bosses.sven.experience)}          Weight: ${roundNumber(apiData.data.slayers.bosses.sven.weight)}`
                        ].join('\n') + '\n```'
                    },
                    {
                        name: `Dungeon Weight: ${roundNumber(apiData.data.dungeons.weight)} + ${roundNumber(apiData.data.dungeons.weight_overflow)} Overflow (${roundNumber(apiData.data.dungeons.weight) + roundNumber(apiData.data.dungeons.weight_overflow)} Total)`,
                        value: '```ruby\n' + [
                            `Catabombs  > Lvl: ${roundNumber(apiData.data.dungeons.types.catacombs.level)}          Weight: ${roundNumber(apiData.data.dungeons.types.catacombs.weight)}`,
                            `Healer     > Lvl: ${roundNumber(apiData.data.dungeons.classes.healer.level)}           Weight: ${roundNumber(apiData.data.dungeons.classes.healer.weight)}`,
                            `Mage       > Lvl: ${roundNumber(apiData.data.dungeons.classes.mage.level)}             Weight: ${roundNumber(apiData.data.dungeons.classes.mage.weight)}`,
                            `Berserker  > Lvl: ${roundNumber(apiData.data.dungeons.classes.berserker.level)}        Weight: ${roundNumber(apiData.data.dungeons.classes.berserker.weight)}`,
                            `Archer     > Lvl: ${roundNumber(apiData.data.dungeons.classes.archer.level)}           Weight: ${roundNumber(apiData.data.dungeons.classes.archer.weight)}`,
                            `Tank       > Lvl: ${roundNumber(apiData.data.dungeons.classes.tank.level)}             Weight: ${roundNumber(apiData.data.dungeons.classes.tank.weight)}`
                        ].join('\n') + '\n```'
                    }
                )
                .setTimestamp()
        ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
    },
};