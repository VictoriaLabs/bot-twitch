const twitchAPI = {
  baseURL: process.env.TWITCH_API_URL,
  clientID: process.env.TWITCH_CLIENT_ID,
  fetchWithHeaders: async function (url, method, body) {
    const response = await fetch(url, {
        method: method || 'GET',
        headers: {
            "Client-ID": this.clientID,
            "Authorization": `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await response.json();
    return data;
},
  getUser: async function (username) {
    const url = `${this.baseURL}/users?login=${username}`;
    return this.fetchWithHeaders(url);
  },
  getFollowers: async (userID) => {
    const url = `${this.baseURL}/channels/followers?broadcaster_id=${userID}`;
    return this.fetchWithHeaders(url);
  },
  getChannelInfo: async function (broadcastID) {
    const url = `${this.baseURL}/channels?broadcaster_id=${broadcastID}`;
    return this.fetchWithHeaders(url);
  },
  getBitsLeaderboard: async () => {
    const url = `${this.baseURL}/bits/leaderboard`;
    return this.fetchWithHeaders(url);
  },
  createPoll: async function (broadcastID, question, options, duration) {
    const url = `${this.baseURL}/polls`;
    const body = {
      broadcaster_id: broadcastID,
      title: question,
      choices: options.map(choice => ({ title: choice })),
      duration: duration || 60
    };
    return this.fetchWithHeaders(url, 'POST', body);
  }
};

module.exports = twitchAPI;
