export type ChatMessage = {
  user: ChatUser;
  content: string;
}

export type ChatUser = 'assistant' | 'human'