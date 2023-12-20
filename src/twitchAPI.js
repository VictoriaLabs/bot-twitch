const twitchAPI = {
  baseURL: process.env.TWITCH_API_URL,
  clientID: process.env.TWITCH_CLIENT_ID,
  fetchWithHeaders: async function (url) {
    const response = await fetch(url, {
      headers: {
        "Client-ID": this.clientID,
        "Authorization": `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`
      }
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
  getChannelInfo: async (broadcastID) => {
    const url = `${this.baseURL}/channels?broadcaster_id=${broadcastID}`;
    return this.fetchWithHeaders(url);
  },
  getBitsLeaderboard: async () => {
    const url = `${this.baseURL}/bits/leaderboard`;
    return this.fetchWithHeaders(url);
  }
};

module.exports = twitchAPI;
