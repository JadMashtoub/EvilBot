const { Client, Intents } = require('discord.js');
const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES
  ]
});

client.on('ready', () => {
  console.log('Bot is ready!');
  const targetUserId = ['338247927560536064','378678200294834176'];
  // Replace with the ID of the user you want to ping
  const targetTime = '10:30'; // Replace with the desired time in HH:MM format (in 24-hour format)

  const checkTime = async () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    if (currentTime === targetTime) {
      const user = await client.users.fetch(targetUserId);
      user.send(`Take your meds cutie`);
    }
  };

  setInterval(checkTime, 40000); // Check every minute (adjust as needed)
});

client.login('MTEyMjAzNTE1ODc1Mzc1MTExMQ.GNyCyY.fmXZyeBGQ1Qmww5laxtozmNcfS70BUJrQdArTg');
