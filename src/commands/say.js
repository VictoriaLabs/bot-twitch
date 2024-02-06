module.exports = {
    name: 'say',
    description: 'Say command',
    response: (client, tags, argument) => argument ? Promise.resolve(argument) : null
};
