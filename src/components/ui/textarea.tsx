'use client'
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, onChange, ...props }, ref) => {
  const maxHeight = 400; // Maximum height in pixels

  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'inherit';
    const newHeight = Math.min(e.target.scrollHeight, maxHeight);
    e.target.style.height = `${newHeight}px`;

    if (onChange) {
      onChange(e); // Call the passed-in onChange function
    }
  };

  return (
    <textarea
      className={cn(`flex w-full leading-snug rounded-md border-none bg-transparent px-5 py-5 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`)}
      onChange={handleResize} // Combine the internal and external onChange handlers
      style={{ maxHeight: `${maxHeight}px` }} // Add a maxHeight style
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
