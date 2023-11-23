require('dotenv').config();

const tmi = require('tmi.js');
const twitchAPI = require('./twitchAPI.js');
const socket = require('./socket.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    ping: {
        response: 'Pong !'
    }
}

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
    
	channels: [ 'victorialabs' ]
});

client.connect().catch((err) => {
    console.error('Failed to connect :', err);
});

client.on('message', (channel, tags, message, self) => {
    const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;

    if (!isNotBot) return;

    const commandMatch = message.match(regexpCommand);

    // Vérifier si le message est une commande
    if (commandMatch) {
        const [raw, command, argument] = commandMatch;

        const { response } = commands[command] || {};

        if (typeof response === 'function') {
            client.say(channel, response(tags.username, argument));
        } else if (typeof response === 'string') {
            client.say(channel, response);
        }
    } else {
        try {
            socket.emitEvent('message', { channel, tags, message });
        } catch (error) {
            console.log("Erreur lors de l'émission d'un message au WebSocket : ", error);
        }
    }
});