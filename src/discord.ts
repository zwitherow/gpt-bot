import * as dotenv from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'

dotenv.config()

export const channelIds = process.env.CHANNEL_IDS?.split(',') ?? []

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})
