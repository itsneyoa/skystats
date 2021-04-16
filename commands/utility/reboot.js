const Discord = require('discord.js');

module.exports = {
    name: 'reboot',
    aliases: ['kill'],
    usage: 'reboot',
    ownerOnly: true,
    description: 'rebooty',
    execute(message, args) {
        process.exit()
    },
};