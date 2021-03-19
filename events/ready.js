const chalk = require('chalk');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(chalk.greenBright(`Logged in as ${client.user.username}!`));
	},
};
