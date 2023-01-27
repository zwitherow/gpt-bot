import { v4 as uuid } from 'uuid'

class Threads {
  private threads: Thread[] = []

  getThreadByMessageId(messageId: string): Thread | undefined {
    return this.threads.find(thread => thread.last === messageId)
  }

  new(initialMessageId: string): string {
    const threadId = uuid()
    this.threads.push({
      id: threadId,
      last: initialMessageId
    })
    return threadId
  }

  setLast(threadId: string, newLast: string): void {
    const thread = this.threads.find(thread => thread.id === threadId)
    if (!thread) return
    thread.last = newLast
  }
}

interface Thread {
  id: string
  last: string
}

export const threads = new Threads()
