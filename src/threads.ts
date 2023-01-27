import { v4 as uuid } from 'uuid'

class Threads {
  private threads: Thread[] = []

  getThreadByMessageId(messageId: string): Thread | undefined {
    return this.threads.find(thread => thread.last === messageId)
  }

  new(initialMessageId: string, prompt: string): Thread {
    const threadId = uuid()
    this.threads.push({
      id: threadId,
      last: initialMessageId,
      conversation: [prompt]
    })
    return this.threads.find(thread => thread.id === threadId)!
  }

  setLast(threadId: string, newLast: string, prompt: string): void {
    const thread = this.threads.find(thread => thread.id === threadId)
    if (!thread) return
    thread.last = newLast
    thread.conversation.push(prompt)
  }

  prompt(threadId: string): string {
    const thread = this.threads.find(thread => thread.id === threadId)
    if (!thread) return null
    const newMessages = thread.conversation.map((message, index) => {
      if (index % 2 === 0) {
        return `User: ${message}`
      }
      return `YOU: ${message}`
    })
    return [...newMessages, 'YOU: '].join('\n\n')
  }
}

interface Thread {
  id: string
  last: string
  conversation: string[]
}

export const threads = new Threads()
