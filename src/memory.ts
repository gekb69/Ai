import { Message } from './types';

export class Memory {
  private messages: Message[] = [];
  private maxTokens: number;

  constructor(maxTokens = 4000) {
    this.maxTokens = maxTokens;
  }

  add(message: Message) {
    this.messages.push(message);
    this.trim();
  }

  getHistory(): Message[] {
    return [...this.messages];
  }

  clear() {
    this.messages = [];
  }

  private trim() {
    // Simple trimming: if too many messages, keep last N
    if (this.messages.length > 50) {
      this.messages = this.messages.slice(-40);
    }
  }
}