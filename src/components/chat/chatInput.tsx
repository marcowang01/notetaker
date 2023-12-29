'use client'

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import SendArrowIcon from "@/icons/rightArrow";
import React, { useState } from 'react';

export default function ChatInput() {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div 
      className={cn(`relative h-auto text-md font-light w-full flex flex-row items-end justify-start bg-gray-100 rounded-xl transition duration-150 ease-in-out z-10`)}
      style={{ boxShadow: isFocused ? 'none' : '0px 0px 20px rgba(0, 0, 0, 0.2)'}}
    >
      <Textarea 
        placeholder="Ask me anything..."
        className={cn("text-md")}
        rows={1}
        value={text}
        onChange={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div style={{ color: text ? 'var(--highlight-rgb)' : 'grey' }}>
        <SendArrowIcon className={cn(`h-9 w-9 m-2 mb-3.5  ${text && "cursor-pointer" }`)} />
      </div>
    </div>
  )
}
