require('dotenv').config();

const Sentry = require("@sentry/node");
const tmi = require('tmi.js');
const socket = require('./socket.js');
const fs = require('fs');
const path = require('path');
const { isNullOrUndefined } = require('util');
const commands = {};

Sentry.init({ dsn: process.env.SENTRY_DSN });

// Expression régulière utilisée pour analyser les commandes de chat.
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: ['victorialabs']
});

client.connect().catch((err) => {
    console.error('Failed to connect :', err);
});

client.on('connected', () => {
    const commandFiles = fs.readdirSync(path.join(__dirname, '/commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands[command.name] = command;
        console.log(`Commande chargée : ${command.name}`)
    }
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
            response(client, tags.username, argument).then(result => {
                if (typeof result === 'string') {
                    console.log(result);
                    client.say(channel, result);
                } else {
                    console.log('Erreur : la réponse de la fonction n\'est pas une chaîne.');
                }
            }).catch(error => {
                console.log('Erreur : ', error);
            });
        }
    } else {
        // Si le message n'est pas une commande, on l'envoie au WebSocket
        try {
            socket.emitEvent('twitch', { channel, tags, message });
        } catch (error) {
            console.log("Erreur lors de l'émission d'un message au WebSocket : ", error);
        }
    }
});