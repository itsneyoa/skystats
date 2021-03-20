const Discord = require('discord.js');
const fetch = require('node-fetch')
const fs = require('fs')
const sleepTime = 500;

const loading = `819138970771652609`;

module.exports = {
    name: 'guildskills',
    aliases: ['gsk', 'guildsk'],
    usage: 'guildskills <guild>',
    description: 'Scans a guild, checking all members total skill experience',
    guildOnly: true,
    async execute(message, args) {
        if (!isOwner(message.author.id)) return message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`Sorry, you don't have permission to do this`)
                .setColor('DC143C')
        )

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

        while(memberUUIDs.length != 0){
            for (uuid of memberUUIDs) {
                try {
                    const skyblockData = await getSkyblockData(uuid);
    
                    try {
                        users.push({ username: skyblockData.data.username, exp: skyblockData.data.weight.toString().substr(0, 9), uuid: uuid });
                        memberUUIDs.shift();
                    } catch {
                        console.log(`Error with UUID ${uuid}`);
                    }

                } catch (e) {
                    console.log(e);
                }

                sentEmbed.edit(
                    new Discord.MessageEmbed()
                        .setTitle(`${guildData.guild.name} Found!`)
                        .setDescription(`Scanning guild - **This will take a while**`)
                        .setColor('FF8C00')
                        .setFooter(`Scanned ${c}/${guildData.guild.members.length}`)
                        .setTimestamp(startTime)
                ).then(c++).then(sleep(sleepTime));
            }
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

    const response = await fetch(`https://hypixel-api.senither.com/v1/profiles/${uuid}/weight?key=${config.discord.apiKey}`);
    return await response.json();
}

function isOwner(member) {
    delete require.cache[require.resolve('../../config.json')];
    const config = require('../../config.json');

    return member == config.discord.ownerId;
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
    var str = 'Username,Exp,uuid\n';

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