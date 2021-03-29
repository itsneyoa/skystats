const Discord = require('discord.js');
const fetch = require('node-fetch')
const fs = require('fs')

const loading = `819138970771652609`;

module.exports = {
    name: 'guildslayer',
    aliases: ['gsl', 'guildsl'],
    usage: 'guildslayer <guild>',
    description: 'Scans a guild, checking all members total slayer experience',
    modOnly: true,
    maniacsOnly: true,
    async execute(message, args) {
        if (!args[0]) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`You need to provide a guild to scan`)
                    .setColor('DC143C')
            )
        }

        message.react(loading);

        const guildName = args.join(' ');

        const guildData = await getGuildData(guildName);
        if (guildData.guild == null) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`Guild \`${guildName}\` not found.`)
                    .setColor('DC143C')
                    .setTimestamp()
            ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
        }

        var memberUUIDs = [];

        guildData.guild.members.forEach(member => {
            let uuid = member.uuid;
            uuid = uuid.substr(0, 8) + "-" + uuid.substr(8, 4) + "-" + uuid.substr(12, 4) + "-" + uuid.substr(16, 4) + "-" + uuid.substr(20);
            memberUUIDs.push(uuid);
        });

        const startTime = Date.now();

        var users = [];

        var c = 0;

        const sentEmbed = await message.channel.send(
            new Discord.MessageEmbed()
                .setTitle(`${guildData.guild.name} Found!`)
                .setDescription(`Scanning guild - **This will take a while**`)
                .setColor('FF8C00')
                .setFooter(`Scanned ${c}/${guildData.guild.members.length}`)
                .setTimestamp()
        )

        c++;

        while (memberUUIDs.length != 0) {
            try {
                const skyblockData = await getSkyblockData(memberUUIDs[0]);
                if (skyblockData.status == '404' || skyblockData.data.skills == null) {
                    memberUUIDs.shift()
                    console.log(`Player ${memberUUIDs[0]} has no profiles or null value`)
                    discordLog(message.client,
                        new Discord.MessageEmbed()
                            .setAuthor(`Error: ${this.name}`, message.client.user.avatarURL())
                            .setDescription(`Player ${memberUUIDs[0]} has no profiles or null value`)
                            .setColor('DC143C')
                            .setTimestamp()
                    )
                }
                else if (['400', '403', '500', '502', '503'].includes(skyblockData.status)) {
                    return sentEmbed.edit(
                        new Discord.MessageEmbed()
                            .setDescription(`There was an error. Please try again later`)
                            .setColor('DC143C')
                            .setFooter(skyblockData.status)
                            .setTimestamp()
                    ).then(
                        discordLog(message.client,
                            new Discord.MessageEmbed()
                                .setAuthor(`Error: ${this.name}`, message.client.user.avatarURL())
                                .setDescription(`Skyblock API Error: \`${apiData.status}\``)
                                .setColor('DC143C')
                                .setTimestamp()
                        )
                    )
                }
                else if (skyblockData.status == '200') {
                    try {
                        users.push({ uuid: memberUUIDs[0], exp: calcSlayer(skyblockData), username: skyblockData.data.username, profile: skyblockData.data.name}); //UUID,Skill Exp,Username,Profile
                        memberUUIDs.shift();
                    } catch {
                        console.log(`Error with UUID ${memberUUIDs[0]}`);
                        discordLog(message.client,
                            new Discord.MessageEmbed()
                                .setAuthor(`Error: ${this.name}`, message.client.user.avatarURL())
                                .setDescription(`Error with UUID ${memberUUIDs[0]}`)
                                .setColor('DC143C')
                                .setTimestamp()
                        )
                    }
                }
                else sleep(10000)

            } catch (e) {
                console.log(e);
                discordLog(message.client,
                    new Discord.MessageEmbed()
                        .setAuthor(`Error: ${this.name}`, message.client.user.avatarURL())
                        .setDescription(`\`${e}\``)
                        .setColor('DC143C')
                        .setTimestamp()
                )
            }

            sentEmbed.edit(
                new Discord.MessageEmbed()
                    .setTitle(`${guildData.guild.name} Found!`)
                    .setDescription(`Scanning guild - **This will take a while**`)
                    .setColor('FF8C00')
                    .setFooter(`Scanned ${c}/${guildData.guild.members.length}`)
                    .setTimestamp(startTime)
            ).then(c++)//.then(sleep(sleepTime));
        }

        const timeTaken = Math.floor((Date.now() - startTime) / 1000); //in seconds

        sentEmbed.edit(
            new Discord.MessageEmbed()
                .setAuthor(guildData.guild.name)
                .setTitle('Finished scanning')
                .setColor('7CFC00')
                .setFooter(`${guildData.guild.members.length} members scanned in ${formatTime(timeTaken)}`)
                .setTimestamp()
        ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))

        const convertedCSV = ConvertToCSV(JSON.stringify(users));
        fs.writeFileSync('./output.csv', convertedCSV, 'utf-8');

        return message.reply(
            new Discord.MessageAttachment('./output.csv')
        )
    },
};

async function getGuildData(guildName) {
    delete require.cache[require.resolve('../../config.json')];
    const config = require('../../config.json');

    const response = await fetch(`https://api.hypixel.net/Guild?key=${config.discord.apiKey}&name=${guildName}`);
    return await response.json();
}

async function getSkyblockData(uuid) {
    delete require.cache[require.resolve('../../config.json')];
    const config = require('../../config.json');

    const response = await fetch(`https://hypixel-api.senither.com/v1/profiles/${uuid}/save?key=${config.discord.apiKey}`);
    return await response.json();
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
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

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = 'UUID,Slayer Exp,Username,Profile\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function calcSlayer(apiData) {
    return apiData.data.slayers.bosses.revenant.experience + apiData.data.slayers.bosses.tarantula.experience + apiData.data.slayers.bosses.sven.experience
}

function discordLog(client, embed) {
    delete require.cache[require.resolve('../../config.json')];
    const config = require('../../config.json');

    client.channels.fetch(config.discord.logChannel)
        .then(channel => channel.send(embed))
        .catch(console.error)
}