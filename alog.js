const Discord = require('discord.js');
const fetch = require('node-fetch-npm');
const config = require('./config.json');
const client = new Discord.Client();
const channelId = '1122051145578324072'; // Right-click and copy the channel ID
let trackedPlayers = []; // Array to store tracked players

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (message.content.startsWith('/track')) {
    const playerUsername = message.content.split(' ')[1];
    if (playerUsername) {
      const channel = client.channels.cache.get(channelId);
      if (!trackedPlayers.includes(playerUsername)) {
        trackedPlayers.push(playerUsername);
        await channel.send(`Now tracking achievements for ${playerUsername}!`);
        checkAchievements(playerUsername, channel);
      } else {
        channel.send(`${playerUsername} is already being tracked.`);
      }
    } else {
      message.channel.send('Please provide a player username to track.');
    }
  }
});

const checkAchievements = async (playerUsername, channel) => {
  try {
    const url = `https://apps.runescape.com/runemetrics/profile/profile?user=${playerUsername}&activities=20`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.activities[0])

    if (data.activities.length > 0) {
      const latestEntry = data.activities[0];
      if (!trackedPlayers.includes(latestEntry.details)) {
        trackedPlayers.push(latestEntry.details);
        console.log(latestEntry)
        const achievementMessage = `${playerUsername}:${latestEntry.text}`;
        channel.send(achievementMessage);
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }

  setTimeout(() => checkAchievements(playerUsername, channel), 30000); // Checks every 30 seconds
};
client.login(config.discordToken);
