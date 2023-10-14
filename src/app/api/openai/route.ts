import OpenAI from "openai";

export async function GET(request: Request) {
  const apiKey: string | undefined = process.env.OPENAI_API_KEY;
  const headers: HeadersInit = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  });

  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {"role": "system", "content": "You are a helpful assistant for note-taking."},
      {"role": "user", "content": "Generate partial notes for the lecture transcript."}
    ],
  });

  const res = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
    method: 'POST',
    headers,
    body,
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      // Add other CORS headers here
    },
  });
}


export async function POST(request: Request) {
  const apiKey: string | undefined = process.env.YOUR_API_KEY;
  const headers: HeadersInit = new Headers({
    'Content-Type': 'application/json',
  });
  if (apiKey) {
    headers.append('API-Key', apiKey);
  }

  const requestBody = await request.json();
  const res = await fetch('your-api-endpoint', {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });
  const data = await res.json();
  return new Response(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      // Add other CORS headers here
    },
  });
}
