import React from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage } from "@/types/messages";

export default function ChatRecord({ user, content }: ChatMessage) {

  const width = user === 'assistant' ? 'w-full' : 'w-3/4'
  const alignment = user === 'assistant' ? 'items-start justify-start' : 'items-end justify-end'
  const color = user === 'assistant' ? 'text-gray-800' : 'text-gray-600 '
  const border = user === 'assistant' ? 'p-4 pt-1 pl-0' : 'bg-gray-300 rounded-md p-4'

  return (
    <div className={cn(`w-full flex flex-col ${alignment} font-light text-md mb-4 `)}>
      <div className={cn(`${width} flex flex-row items-center ${alignment} gap-1`)}>
        <span className={cn(`${color} text-md`)}>{user}</span>
      </div>
      <div className={cn(`${width}  flex flex-col ${alignment} gap-1 ${border}`)}>
        <span className={cn(`${color} text-lg`)}>{content}</span>
      </div>
    </div>
  )
}
