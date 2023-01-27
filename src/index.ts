import { client, channelIds } from './discord.js'
import { openai } from './openai.js'
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

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: threads.prompt(thread.id),
    temperature: 0.9,
    max_tokens: 2048
  })

  if (!response?.data?.choices?.length) return

  const replyText = response.data.choices[0].text.replace('\n\n', '') || ''

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

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: threads.prompt(thread.id),
    temperature: 0.9,
    max_tokens: 2048
  })

  if (response.data.choices.length === 0) return

  const reply = await message.reply(response.data.choices[0].text)

  threads.setLast(thread.id, reply.id, reply.content)
})

client.login(process.env.DISCORD_TOKEN)
