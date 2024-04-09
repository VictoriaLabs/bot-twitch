require('dotenv').config();

const socket = require('socket.io-client')(process.env.WEBSOCKET_URL);

socket.on('connect', () => {
    socket.emit('join', 'victoria');
});

function emitEvent(eventName, data) {
    if (socket.connected)
      socket.emit(eventName, data);
    else
      console.log('Le socket n\'est pas connecté.');
};

function onEvent(eventName, callback) {
    socket.on(eventName, callback);
};

function disconnect() {
    socket.disconnect();
    console.log('Déconnecté du serveur WebSocket');
};

module.exports = { emitEvent, onEvent, disconnect };