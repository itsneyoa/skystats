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
    guildOnly: false,
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