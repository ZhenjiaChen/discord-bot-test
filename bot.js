const Discord = require('discord.js');
const client = new Discord.Client();

const syllables = require('./syllables.json');

function getSyllables(word) {
    try {
        return syllables[word];
    } catch(err) {
        return 0;
    }
}

function isHaiku(message) {
    let syllable_count = 0;
    let mark1 = false;
    let mark2 = false;
    let mark3 = false;
    message = message.split(/[ ]+/); 
    if (message.length > 17) {
        return false;
    } else {
        try {
            for (let i=0; i<message.length; i++) {
                word = message[i];
                syllable_count += getSyllables(word);
                if (syllable_count === 5) {
                    mark1 = true;
                } else if (syllable_count > 5 && !mark1) {
                    return false
                } else if (syllable_count == 12) {
                    mark2 = true;
                } else if (syllable_count > 12 && !mark2) {
                    return false;
                } else if (syllable_count == 17) {
                    mark3 = true;
                } else if (syllable_count > 17) {
                    return false;
                }
            }
            return mark1 && mark2 && mark3;
        } catch (err) {
            return false
        }
    }
}

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {

    if (message.content === 'ping') {
        message.reply('pong');
    } else if (isHaiku(message.content)) {
        message.reply('haiku');
    }

});

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret