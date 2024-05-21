const twitchAPI = require('../twitchAPI.js');

module.exports = {
    name: 'poll',
    description: 'Poll command',
    response: async (client, argument) => {
        try {
            const user = await twitchAPI.getUser(client.getChannels()[0].replace('#', ''));
            if (user.data && user.data.length > 0) {
                const channel = await twitchAPI.getChannelInfo(user.data[0].id);
                if (channel.data && channel.data.length > 0) {
                    const broadcastID = channel.data[0].broadcaster_id;
                    const question = argument;
                    const options = ['Oui', 'Non'];
                    const poll = await twitchAPI.createPoll(broadcastID, question, options);
                    if (poll.data)
                        return `Le sondage "${question}" a été créé !`;
                    else if (poll.error && poll.status === 403)
                        return `Erreur : Le sondage n'a pas pu être créé, car le diffuseur n'est pas partenaire ou affilié.`;
                    else
                        return `Erreur : ${poll.error}`;
                } else
                    return `Erreur : impossible de récupérer les informations de la chaîne.`;
            } else
                return `Erreur : impossible de récupérer les informations de l'utilisateur.`;
        } catch (error) {
            return `Erreur : ${error.message}`;
        }
    }
}