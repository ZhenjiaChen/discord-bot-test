const Discord = require('discord.js');
const client = new Discord.Client();

const syllables = require('./syllables.json');

function preProcessWord(word) {
    word = word.replace(/[!\"#$%&()*+,-./:;<=>?@[\]^_`{|}~]/,"").toLowerCase();
    return word
}

function getSyllables(word) {

    try {
        console.log(preProcessWord(word) + " : " + syllables[preProcessWord(word)])
        return syllables[preProcessWord(word)];
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

                let syllable_of_word = getSyllables(word);
                if (syllable_of_word === 0) {
                    return false;
                }

                syllable_count += syllable_of_word;
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

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function makeHaiku(haiku) {
    let line1 = "";
    let line2 = "";
    let line3 = "";
    let syllable_count = 0;
    let originalCase = haiku.split(/[ ]+/);
    let lowerCase = preProcessWord(haiku).split(/[ ]+/);
    
    for (let i=0; i<lowerCase.length; i++) {
        syllable_count += getSyllables(lowerCase[i]);
        if (syllable_count <= 5){
            if (line1.length === 0) {
                line1 = line1.concat(capitalize(originalCase[i]) + " ");
            } else {
                line1 = line1.concat(originalCase[i] + " ");
            }
        } else if (syllable_count <= 12) {
            if (line2.length === 0) {
                line2 = line2.concat(capitalize(originalCase[i]) + " ");
            } else {
                line2 = line2.concat(originalCase[i] + " ");
            }
        } else if (syllable_count <= 17) {
            if (line3.length === 0) {
                line3 = line3.concat(capitalize(originalCase[i]) + " ");
            } else {
                line3 = line3.concat(originalCase[i] + " ");
            }
        }
    }
    return line1 + "\n" + line2 + "\n" + line3;
}

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {

    if (message.author == client.user) {
        return;
    }

    if (message.content === '!ping') {
        message.reply('pong');
    } else if (isHaiku(message.content)) {
        console.log("haiku found");
        message.channel.send(makeHaiku(message.content) + "\n\n               -" + message.author);
    }

});

client.login(process.env.BOT_TOKEN);