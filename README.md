# Discord Chat Bot

A basic chat bot with AI responses running on NodeJS. Uses OpenAI text-davinci-003.

Mention (@bot-name) with your initial prompt to start a new thread. Reply to the latest response to continue the conversation. Threads are stored in memory and expire after 24 hours of inactivity.

## Commands

`!help` - Displays help text

`!threads` - Show number of active threads

## Instructions

Copy 'example.env' to '.env' and replace values.

You can change the expiration value in `src/openai.ts` by editing the `ttl` variable.

You can change the config values for the AI responses in `src/openai.ts`.
