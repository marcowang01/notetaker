import { useChat, Message, CreateMessage } from 'ai/react';

type CustomChatOptions = {
  systemPrompt: string;
  onFinish: (message: Message) => void;
  onError: (err: Error) => void;
  model?: string;
};

// custom hook to create a new chat with a system prompt
function useCustomChat(options: CustomChatOptions) {
  const { systemPrompt, onFinish, onError } = options;

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
  });


  return {
    messages,
    append: customAppend(append),
  };
}

// higher order function to append messages with model as a request option
function customAppend(append: (message: CreateMessage, options?: any) => void) {
  return function (message: CreateMessage, model?: string) {
    const requestOptions = {
      options: {
        body: {
          model: model,
        }
      }
    };
    append(message, requestOptions);
  };
}

export default useCustomChat;
