module.exports = {
    name: 'ping',
    description: 'Ping command',
    response: () => Promise.resolve('Pong !')
};
