import { client, channelIds } from './discord.js'
import { threads } from './thread.js'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

// new thread
client.on('messageCreate', async message => {
  if (
    !channelIds.includes(message.channelId) || // don't listen to other channels
    message.author.bot || // don't listen to bots
    message.mentions.users.map((_, id) => id).length !== 1 || // don't listen to mentions with more than one user
    !message.mentions.users.map((_, id) => id).includes(client.user.id) || // don't listen to mentions without the bot
    message.type.valueOf() === 19 // don't listen to replies
  ) {
    return
  }

  const threadId = threads.new(message.id)

  const prompt = message.content.trim().split(' ').slice(1).join(' ')
  const reply = await message.reply(`New Thread ID ${threadId}:\n${prompt}`)

  threads.setLast(threadId, reply.id)
})

// continue thread
client.on('messageCreate', async message => {
  if (
    !channelIds.includes(message.channelId) || // don't listen to other channels
    message.author.bot || // don't listen to bots
    !message.mentions.users.map((_, id) => id).includes(client.user.id) || // don't listen to mentions without the bot
    message.type.valueOf() !== 19 // don't listen to non-replies
  ) {
    return
  }

  const thread = threads.getThreadByMessageId(message.reference.messageId)
  if (!thread) return

  const threadId = thread.id

  const reply = await message.reply(
    `Continue Thread ID ${threadId}:\n${message.content}`
  )

  threads.setLast(threadId, reply.id)
})

client.login(process.env.DISCORD_TOKEN)
