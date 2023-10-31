import { LiveTranscription } from "@deepgram/sdk/dist/transcription/liveTranscription";

async function openMicrophone(microphone: MediaRecorder, socket: WebSocket) {
  await microphone.start(500);

  microphone.onstart = () => {
    console.log("client: microphone opened");
  };

  microphone.onstop = () => {
    console.log("client: microphone closed");
  };

  microphone.ondataavailable = (e) => {
    const data = e.data;
    // console.log("client: sent data to websocket");
    socket.send(data);
  };
}

async function closeMicrophone(microphone: MediaRecorder) {
  microphone.stop();
}

async function getMicrophone() {
  const userMedia = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  return new MediaRecorder(userMedia, { mimeType: "audio/webm" });
}


async function getTempDeepGramApiKey(): Promise<string> {
  const result = await fetch("/api/deepgram/temp-key");
  const json = await result.json();

  console.log(json)

  if (typeof json.key !== 'string') {
    throw new Error(`Received key is not of type string: ${json.key}`);
  }

  return json.key;
}



const getDeepgramSocket = async () => {
  
  const key = await getTempDeepGramApiKey();

  const params = {
    language: 'en-US',
    punctuate: true,
    smart_format: true,
    numerals: true,
    interim_results: true,
    keywords: ['econ', 'physics'],
  };

  // Convert the parameters into a query string format
  const serializedParams = Object.entries(params)
    .flatMap(([key, value]) => {
      if (key === 'keywords' && Array.isArray(value)) {
        // Convert each keyword into its own parameter
        return value.map(keyword => `keywords=${encodeURIComponent(keyword)}:5`);
      } else if (!Array.isArray(value)) {
        // Convert the parameter into a query string format for non lists
        return `${key}=${encodeURIComponent(value)}`;
      }
    })
    .join('&');
  
  const baseUrl = "wss://api.deepgram.com/v1/listen";
  const urlWithParameters = `${baseUrl}?${serializedParams}`;
  
  const socket = new WebSocket(urlWithParameters, ['token', key]);

  return socket;
}

export {
  openMicrophone,
  closeMicrophone,
  getMicrophone,
  getDeepgramSocket
}
