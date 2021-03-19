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

Add commas to long numbers
```
.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
```

New command template
```
const Discord = require('discord.js');

module.exports = {
    name: 'a',
    aliases: ['aa', 'aaa'],
    description: 'aaaaaaaaaa',
    execute(message, args) {
        
    },
};
```

Reload config
```
delete require.cache[require.resolve('../../config.json')];
const config = require('../../config.json');
```