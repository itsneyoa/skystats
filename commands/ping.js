const Discord = require('discord.js');
const config = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
	name: 'ping',
    aliases: ['latency'],
	description: 'Gets latency of the bot',
	execute(message, args) {
        message.channel.send(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms`);
	},
};