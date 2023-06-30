const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');
const client = new Discord.Client();
const prefix = '/';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ge') {
    if (args[0] === 'all') {
      try {
        const url = 'https://secure.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=0';
        const response = await axios.get(url);
        const items = response.data.items;

        const embed = new Discord.MessageEmbed()
          .setTitle('Grand Exchange Summary - All Items')
          .setDescription('Here is a list of all items in the Grand Exchange:');

        for (const item of items) {
          embed.addField(item.name, `Price: ${item.current.price}`);
        }

        message.channel.send(embed);
      } catch (error) {
        console.error('An error occurred while fetching Grand Exchange summary:', error);
        message.channel.send('Error occurred while fetching Grand Exchange summary. Please try again.');
      }
    } else {
      const itemName = args.join(' ');

      try {
        const encodedItemName = encodeURIComponent(itemName);
        const url = `https://secure.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=0&alpha=${encodedItemName}`;
        const response = await axios.get(url);
        const items = response.data.items;

        if (items.length === 0) {
          message.channel.send('No items found matching the search query.');
          return;
        }

        const embed = new Discord.MessageEmbed()
          .setTitle('Grand Exchange Summary')
          .setDescription(`Items matching "${itemName}":`);

        for (const item of items) {
          embed.addField(item.name, `Price: ${item.current.price}`);
        }

        message.channel.send(embed);
      } catch (error) {
        console.error('An error occurred while fetching Grand Exchange summary:', error);
        message.channel.send('Error occurred while fetching Grand Exchange summary. Please try again.');
      }
    }
  }
});

client.login(config.discordToken);
