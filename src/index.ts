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

client.on('messageCreate', async message => {
  if (!channelIds.includes(message.channelId) || message.author.bot) return
  message.channel.send('nice message')
})

client.login(process.env.TOKEN)
