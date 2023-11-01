import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai'
 
export const runtime = 'edge'
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
 
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, model } = await req.json()

  // console.log(model)
  // console.log(messages[messages.length - 1])
 
  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: model || 'gpt-3.5-turbo-16k', // default to the 16k model
    messages: messages,
    stream: true,
    // max_tokens: 500,
    // temperature: 0.7,
    // top_p: 1,
    // frequency_penalty: 1,
    // presence_penalty: 1,
  });
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
 
  // Respond with the stream
  return new StreamingTextResponse(stream)
}