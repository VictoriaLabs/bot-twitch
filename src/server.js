require('dotenv').config();

const Sentry = require("@sentry/node");
const tmi = require('tmi.js');
const socket = require('./socket.js');
const fs = require('fs');
const path = require('path');
const twitchAPI = require('./twitchAPI.js');
const commands = {};

Sentry.init({ dsn: process.env.SENTRY_DSN });

// Expression régulière utilisée pour analyser les commandes de chat.
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

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

    
    client.on('connected', () => {
        const commandFiles = fs.readdirSync(path.join(__dirname, '/commands')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            commands[command.name] = command;
            console.log(`Commande chargée : ${command.name}`)
        }

        client.on('stream-up', (channel, tags) => {
            console.log(`Stream by ${tags['display-name']} just went live!`);
            socket.emitEvent('streamLive', channel);
        });
    });
});

socket.onEvent('stop', (data) => {
    if (!client || !data.twitch) return;

    client.disconnect();
    socket.offEvent('receiveMessage');
});

socket.onEvent('receiveMessage', (message) => {
    // if (message.platform === 'twitch') {
    //     client.say(message.channelName, message.message);
    // }
    console.log(message);
});