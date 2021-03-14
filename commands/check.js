const Discord = require('discord.js');
const config = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
	name: 'check',
    aliases: ['c'],
	description: 'Gets metrics about a player',
	execute(message, args) {
        message.channel.send('owo');
	},
};