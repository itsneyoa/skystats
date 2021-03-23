const Discord = require('discord.js');
const fs = require('fs')

module.exports = {
    name: 'write',
    aliases: ['w'],
    usage: 'write',
    description: 'tests writing',
    ownerOnly: false,
    execute(message, args) {
        var users = [];
        c = 0;
        while (c < 100){
            users.push({user: c, userId: c%7, uuid: "penis"})
            c++;
        }

        /*const text = users.map(JSON.stringify).reduce((prev, next) => `${prev},\n${next}`);
        fs.writeFileSync('./output.json', text, 'utf-8');*/

        const convertedCSV = ConvertToCSV(JSON.stringify(users));
        fs.writeFileSync('./output.csv', convertedCSV, 'utf-8');
    },
};

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