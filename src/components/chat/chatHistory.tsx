'use client'

import React, { useRef, useEffect } from 'react';
import ChatRecord from './chatRecord';
import { ChatMessage } from "@/types/messages";
import { cn } from '@/lib/utils';
import styles from './chat.module.css';

export default function ChatHistory({ messages }: { messages: ChatMessage[] }) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      // Scroll to the bottom of the chat container
      const scrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTop = scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatContainerRef} className={cn(`p-24 overflow-y-auto z-10 flex flex-col`)}>
      <div className={cn(`flex flex-col gap-2 justify-start items `)}>
        {messages.map((message, index) => (
          <ChatRecord 
            key={index} 
            user={message.user} 
            content={message.content} 
          />
        ))}
      </div>
    </div>
  )
}

