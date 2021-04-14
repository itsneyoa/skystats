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

        if (res.scammerInfo.scammer) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setAuthor(res.name, `https://mc-heads.net/avatar/${res.name}`)
                    .addField(`User is a scammer`, [
                        `**Reason:** ${res.scammerInfo.reason}`,
                        `**Staff:** \`${res.scammerInfo.staff}\``
                    ].join('\n'))
                    .setColor('DC143C')
                    .setFooter(`UUID: ${res.uuid}`)
                    .setTimestamp()
            ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
        } else {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setAuthor(res.name, `https://mc-heads.net/avatar/${res.name}`)
                    .addField(`User is not a scammer`, `Please still be careful when trading with anyone!`)
                    .setColor('7CFC00')
                    .setFooter(`UUID: ${res.uuid}`)
                    .setTimestamp()
            ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
        }
    }
};

async function scamCheck(ign) {
    const res = await fetch(`https://neyoa.me/api/skyblock/scammer?ign=${ign}`)
    resJson = await res.json()
    return resJson
}