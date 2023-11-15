const twitchAPI = {
  baseURL: "https://api.twitch.tv/helix",
  clientID: process.env.TWITCH_CLIENT_ID,
  getUser: async (username) => {
    const response = await fetch(`${twitchAPI.baseURL}/users?login=${username}`, {
      headers: {
        "Client-ID": twitchAPI.clientID,
        "Authorization": `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`
      }
    });
    const data = await response.json();
    return data;
  },
  getFollowers: async (userID) => {
    const response = await fetch(`${twitchAPI.baseURL}/channels/followers?broadcaster_id=${userID}`, {
      headers: {
        "Client-ID": twitchAPI.clientID,
        "Authorization": `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`
      }
    });
    const data = await response.json();
    return data;
  },
  getChannelInfo: async (broadcastID) => {
    const response = await fetch(`${twitchAPI.baseURL}/channels?broadcaster_id=${broadcastID}`, {
      headers: {
        "Client-ID": twitchAPI.clientID,
        "Authorization": `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`
      }
    });
    const data = await response.json();
    return data;
  },
  getBitsLeaderboard: async () => {
    const reponse = await fetch(`${twitchAPI.baseURL}/bits/leaderboard`, {
      headers: {
        "Client-ID": twitchAPI.clientID,
        "Authorization": `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`
      }
    });
    const data = await response.json();
    return data;
  }
};

module.exports = twitchAPI;
