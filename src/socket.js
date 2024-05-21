require('dotenv').config();

const socket = require('socket.io-client')(process.env.WEBSOCKET_URL);


function emitEvent(eventName, data) {
  if (socket.connected)
    socket.emit(eventName, data);
  else
    console.log('Le socket n\'est pas connecté.');
};

function onEvent(eventName, callback) {
  socket.on(eventName, callback);
};

function offEvent(eventName) {
  socket.off(eventName);
};

function disconnect() {
  socket.disconnect();
  console.log('Déconnecté du serveur WebSocket');
};

onEvent('connect', () => {
  console.log('Connecté au serveur WebSocket')
  socket.emit('join', "victoria")
});

module.exports = { socket, emitEvent, onEvent, offEvent, disconnect };