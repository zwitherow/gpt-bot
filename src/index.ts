import * as dotenv from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'

dotenv.config()

const channelIds = process.env.CHANNEL_IDS?.split(',') ?? []

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

// new thread
client.on('messageCreate', async message => {
  if (
    !channelIds.includes(message.channelId) ||
    message.author.bot ||
    message.mentions.users.map((_, id) => id).length !== 1 ||
    !message.mentions.users.map((_, id) => id).includes(client.user.id) ||
    message.type.valueOf() === 19
  ) {
    return
  }

  const prompt = message.content.trim().split(' ').slice(1).join(' ')
  message.reply('start a new thread with prompt: ' + prompt)
})

// continue thread
client.on('messageCreate', async message => {
  if (
    !channelIds.includes(message.channelId) ||
    message.author.bot ||
    !message.mentions.users.map((_, id) => id).includes(client.user.id) ||
    message.type.valueOf() !== 19
  ) {
    return
  }

  message.reply('continue thread #<ID> with new prompt: ' + message.content)
})

client.login(process.env.DISCORD_TOKEN)
