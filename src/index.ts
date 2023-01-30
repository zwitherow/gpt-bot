import { client, channelIds } from './discord.js'
import { createCompletion, createImage } from './openai.js'
import { threads } from './threads.js'

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

  const prompt = message.content.trim().split(' ').slice(1).join(' ')

  const thread = threads.new(message.id, prompt)

  const replyText = await createCompletion(threads.prompt(thread.id))

  if (!replyText) return

  const reply = await message.reply(replyText)

  threads.setLast(thread.id, reply.id, reply.content)
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

  threads.setLast(thread.id, message.id, message.content)

  const replyText = await createCompletion(threads.prompt(thread.id))

  if (!replyText) return

  const reply = await message.reply(replyText)

  threads.setLast(thread.id, reply.id, reply.content)
})

// commands
client.on('messageCreate', async message => {
  if (
    !channelIds.includes(message.channelId) || // don't listen to other channels
    message.author.bot // don't listen to bots
  ) {
    return
  }

  let replyText = ''

  switch (message.content.split(' ')[0]) {
    case '!help':
      replyText = `**Mention** me in a message to start a conversation. **Reply** to my messages to continue the conversation. Make sure to only reply to my **last** message in a given conversation.`
      break

    case '!threads':
      replyText = `There are currently **${
        threads.threads().length
      }** active threads.`
      break

    case '!image':
      const prompt = message.content.trim().split(' ').slice(1).join(' ')
      if (prompt) {
        const result = await createImage(prompt)
        if (result instanceof Buffer) {
          message.reply({ files: [result] })
        } else {
          message.reply(result)
        }
        break
      } else {
        replyText = `Please provide a prompt.`
      }
      break
  }

  if (replyText) {
    message.reply(replyText)
  }
})

client.login(process.env.DISCORD_TOKEN)
