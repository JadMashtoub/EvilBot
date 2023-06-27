const Discord = require('discord.js');
const fetch = require('node-fetch-npm');

const client = new Discord.Client();
const channelId = '1122051145578324072'; // Right-click and copy the channel ID
let trackedPlayers = []; // Array to store tracked players
let lastEntryId = null; // Variable to store the last entry ID

client.on('ready', () => {
  console.log('Bot is ready!');
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
      if (latestEntry.details !== lastEntryId) {
        lastEntryId = latestEntry.details;

        channel.send(`New achievement for ${playerUsername}!`);
        channel.send(latestEntry.text);
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }

  setTimeout(() => checkAchievements(playerUsername, channel), 30000); // Checks every 30 seconds
};
client.login('MTEyMjAzNTE1ODc1Mzc1MTExMQ.GNyCyY.fmXZyeBGQ1Qmww5laxtozmNcfS70BUJrQdArTg');
