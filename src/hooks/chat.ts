import { useChat, Message } from 'ai/react';

type CustomChatOptions = {
  systemPrompt: string;
  onFinish: (message: Message) => void;
  onError: (err: Error) => void;
  model?: string;
};

function useCustomChat(options: CustomChatOptions) {
  const { systemPrompt, onFinish, onError, model } = options;

  const { messages, append } = useChat({
    api: '/api/openai',
    initialMessages: [
      {
        id: '0',
        role: 'system',
        content: systemPrompt,
      },
    ],
    onFinish: onFinish,
    onError: onError,
    body: {
      model: model,
    },
  });

  return {
    messages,
    append,
  };
}

export default useCustomChat;
