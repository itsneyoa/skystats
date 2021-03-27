Get IGN from mention, nick or input
```
if (!args[0]) {
			var ign = message.member.displayName;
		} else {
			if(message.mentions.members.first()){
				var ign = message.mentions.members.first().displayName;
			}
			else var ign = args[0];
		}
```

Remove funny characters from IGN input
```
.replace(/\W/g, '');
```

Add dashes to uuid
```
uuid.substr(0, 8) + "-" + uuid.substr(8, 4) + "-" + uuid.substr(12, 4) + "-" + uuid.substr(16, 4) + "-" + uuid.substr(20);
```

Add commas to long numbers
```
.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
```

New command template
```
const Discord = require('discord.js');

module.exports = {
    name: 'hi',
    aliases: ['hello'],
    usage: 'hi',
    description: 'Says hi!',
    ownerOnly: false,
    execute(message, args) {

    },
};
```

Reload config
```
delete require.cache[require.resolve('../../config.json')];
const config = require('../../config.json');
```

Remove all reactions
```
message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
```

Seconds to h:m:s
```
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
```

Log to discord channel
```
function discordLog(client, embed) {
    delete require.cache[require.resolve('../../config.json')];
    const config = require('../../config.json');

    client.channels.fetch(config.discord.logChannel)
        .then(channel => channel.send(embed))
        .catch(console.error)
}
```

Embed to log
```
discordLog(message.client,
                    new Discord.MessageEmbed()
                        .setAuthor(`Error: ${this.name}`, message.client.user.avatarURL())
                        .setDescription(`\`${e}\``)
                        .setColor('DC143C')
                        .setTimestamp()
                )
```