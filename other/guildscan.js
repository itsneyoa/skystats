const Discord = require('discord.js');
const fetch = require('node-fetch')

const loading = `819138970771652609`;

module.exports = {
    name: 'guildscan',
    aliases: ['gsc', 'scanguild'],
    usage: 'guildscan <guild>',
    description: 'Scans a guild, checking all members against requirements',
    ownerOnly: true,
    async execute(message, args) {
        delete require.cache[require.resolve('../../config.json')];
        const config = require('../../config.json');

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

        var members = [];

        guildData.guild.members.forEach(member => {
            let uuid = member.uuid;
            uuid = uuid.substr(0, 8) + "-" + uuid.substr(8, 4) + "-" + uuid.substr(12, 4) + "-" + uuid.substr(16, 4) + "-" + uuid.substr(20);
            members.push(uuid);
        });

        const sentEmbed = await message.channel.send(
            new Discord.MessageEmbed()
                .setTitle(`${guildData.guild.name} Found!`)
                .setDescription(`Scanning guild - **This will take a while**`)
                .setColor('FF8C00')
                .setTimestamp()
        )

        const startTime = Date.now();

        var kicking = [];
        var apiOff = [];

        var c = 1;
        for (uuid of members) {
            try{
                const skyblockData = await getSkyblockData(uuid);
                if (skyblockData.data.skills.apiEnabled == false) apiOff.push(skyblockData.data.username);
                else if (!((skyblockData.data.weight + skyblockData.data.weight_overflow) >= config.requirements.guild.weight)) kicking.push(skyblockData.data.username);
            } catch(e) {
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
                    .setFooter(`${c}/${members.length}`)
                    .setTimestamp()
            ).then(c++)

            sleep(1000);
        }

        if (!kicking.length) kicking.push('No-one :)');
        if (!apiOff.length) apiOff.push('No-one :)')

        const timeTaken = Math.floor((Date.now() - startTime) / 1000); //in seconds


        sentEmbed.edit(
            new Discord.MessageEmbed()
                .setAuthor(guildData.guild.name)
                .setTitle('Finished scanning')
                .addField(`Below requirements:`, kicking.join('\n'), true)
                .addField(`Api disabled:`, apiOff.join('\n'), true)
                .setColor('7CFC00')
                .setFooter(`${c} members found in ${formatTime(timeTaken)}`)
                .setTimestamp()
        ).then(message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)))
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

function discordLog(client, embed) {
    delete require.cache[require.resolve('../../config.json')];
    const config = require('../../config.json');

    client.channels.fetch(config.discord.logChannel)
        .then(channel => channel.send(embed))
        .catch(console.error)
}