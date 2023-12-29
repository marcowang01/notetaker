import ChatInput from "@/components/chat/chatInput"
import ChatHistory from "@/components/chat/chatHistory"
import { ChatMessage, ChatUser } from "@/types/messages"
import { cn } from "@/lib/utils"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Scribe - Chat",
}

export default function Chat() {

  function generateChatMessages(numberOfMessages: number) {
    const messages = [];
    const baseContent = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, quibusdam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, quibusdam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, quibusdam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, quibusdam.';
  
    for (let i = 0; i < numberOfMessages; i++) {
      const user: ChatUser = i % 2 === 0 ? 'human' : 'assistant';
      const content = `${baseContent} ${baseContent}`;
      const message: ChatMessage = { user, content };

      messages.push({ user, content });
    }
  
    return messages;
  }
  
  // Usage
  const messages = generateChatMessages(12);  

  return (
    <main className={cn("h-full w-full max-w-[1000px] flex flex-col items-center justify-start overflow-hidden pb-24")}>
      <div className={cn("relative h-full w-full flex flex-col items-center justify-start gap-4")}>
        <ChatHistory messages={messages} />
        <div className={cn("absolute w-full top-0 right-0 h-24 bg-gradient-to-b from-gray-200 from-30% to-transparent z-10")}></div>
      </div>
      <div className={cn("w-full px-24")}>
        <ChatInput />
      </div>
    </main>
  )
}
