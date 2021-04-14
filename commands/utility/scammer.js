const Discord = require('discord.js');
const fetch = require('node-fetch');

const loading = `819138970771652609`;

module.exports = {
    name: 'scammer',
    aliases: ['s', 'sc', 'scheck', 'scam'],
    usage: 'scammer <ign/@mention>',
    tldr: 'Finds if a player is on the scammer list',
    description: 'Uses the SkyblockZ scammer list and returns if a user is a scammer, and if so gives reasoning.',
    maniacsOnly: false,
    async execute(message, args) {
        if (!args[0]) {
            var ign = message.member.displayName;
        } else {
            if (message.mentions.members.first()) {
                var ign = message.mentions.members.first().displayName;
            }
            else var ign = args[0];
        } // Gets IGN

        ign = ign.replace(/\W/g, ''); // removes weird characters

        message.react(loading);

        const res = await scamCheck(ign)
        if (res.status != 200) {
            if (res.status == 405) {
                return message.channel.send(
                    new Discord.MessageEmbed()
                        .setColor('FF8C00')
                        .setTitle(`Invalid player specified`)
                        .setDescription(`Player \`${ign}\` could not be found`)
                        .setFooter(`${res.status} - ${res.statusText}`)
                        .setTimestamp()
                )
            } else {
                return message.channel.send(
                    new Discord.MessageEmbed()
                        .setColor('FF8C00')
                        .setTitle(`Something went wrong`)
                        .setDescription(`Please try again later`)
                        .setFooter(`${res.status} - ${res.statusText}`)
                        .setTimestamp()
                )
            }
        }
        const resJson = await res.json()

        if (resJson.scammerInfo.scammer) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setAuthor(resJson.name, `https://mc-heads.net/avatar/${resJson.name}`)
                    .addField(`User is a scammer`, [
                        `**Reason:** ${resJson.scammerInfo.reason}`,
                        `**Staff:** \`${resJson.scammerInfo.staff}\``
                    ].join('\n'))
                    .setColor('DC143C')
                    .setFooter(`UUID: ${resJson.uuid}`)
                    .setTimestamp()
            ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
        } else {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setAuthor(resJson.name, `https://mc-heads.net/avatar/${resJson.name}`)
                    .addField(`User is not a scammer`, `Please still be careful when trading with anyone!`)
                    .setColor('7CFC00')
                    .setFooter(`UUID: ${resJson.uuid}`)
                    .setTimestamp()
            ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
        }
    }
};

async function scamCheck(ign) {
    const res = await fetch(`https://neyoa.me/api/skyblock/scammer?ign=${ign}`)
    return res
}