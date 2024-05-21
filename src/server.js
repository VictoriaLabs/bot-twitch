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

let client;

socket.onEvent('start', async (data) => {
    if (!data.twitch) return;

    client = new tmi.Client({
        options: { debug: true },
        identity: {
            username: process.env.TWITCH_BOT_USERNAME,
            password: process.env.TWITCH_OAUTH_TOKEN
        },
        
        channels: [ data.twitch ]
    });
    
    client.connect().catch((err) => {
        console.error('Failed to connect :', err);
    });
    
    client.on('message', (channel, tags, message, self) => {
        if (!tags.username) return;
        if (tags.username.toLowerCase() == process.env.TWITCH_BOT_USERNAME.toLowerCase()) return;
    
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
                const data = {
                    platform: "twitch",
                    channel: channel.slice(1),
                    username: tags.username,
                    message: message,
                  };
                socket.emitEvent('sendMessage', data);
            } catch (error) {
                console.log("Erreur lors de l'émission d'un message au WebSocket : ", error);
            }
        }
    });
    
    socket.onEvent('receiveMessage', (message) => {
        // client.say(message.channel, "["+message.username+"]" +message.message);
        client.say("victorialabs", "["+message.username+"] : " +message.message);
    });
});

socket.onEvent('stop', (data) => {
    if (!client || !data.twitch) return;

    client.disconnect();
    socket.offEvent('receiveMessage');
});