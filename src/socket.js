const socket = require('socket.io-client')('http://localhost:4000');

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