import { v4 as uuid } from 'uuid'

const ttl = 1000 * 60 * 60 * 24 // 24 hours

class Threads {
  private _threads: Thread[] = []

  private _prune(): void {
    const now = Date.now()
    this._threads = this._threads.filter(thread => now - thread.time < ttl)
  }

  threads(): Thread[] {
    this._prune()
    return this._threads
  }

  getThreadByMessageId(messageId: string): Thread | undefined {
    return this._threads.find(thread => thread.last === messageId)
  }

  new(initialMessageId: string, prompt: string): Thread {
    const threadId = uuid()
    this._threads.push({
      id: threadId,
      last: initialMessageId,
      time: Date.now(),
      conversation: [prompt]
    })
    this._prune()
    return this._threads.find(thread => thread.id === threadId)!
  }

  setLast(threadId: string, newLast: string, prompt: string): void {
    const thread = this._threads.find(thread => thread.id === threadId)
    if (!thread) return
    thread.last = newLast
    thread.time = Date.now()
    thread.conversation.push(prompt)
    this._prune()
  }

  prompt(threadId: string): string {
    const thread = this._threads.find(thread => thread.id === threadId)
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
  time: number
  conversation: string[]
}

export const threads = new Threads()
