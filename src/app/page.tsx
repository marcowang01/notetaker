'use client'

import { useEffect, useState, useRef } from 'react'
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useChat, Message, CreateMessage } from 'ai/react'

import styles from './page.module.css'

export default function Home() {
  
  const { transcript, finalTranscript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  const transcriptRef = useRef(transcript);
  const transcriptIndexRef = useRef(0);
  const transcriptBacktrackIndex = 4000; // backtrack ~1000 tokens
  const lastTranscriptIndex = useRef(0); // for generating time stamps
  const lastTimeStamp = useRef(0); // for generating time stamps
  const timeStampInterval = 30000; // 30 seconds in milliseconds

  const notesRef = useRef('');
  const [displayNotes, setDisplayNotes] = useState('');
  const [displayTranscript, setDisplayTranscript] = useState('');

  const [lectureStartTime, setLectureStartTime] = useState<number | null>(null);;
  const second = 1000;
  const minute = 60 * second;
  const noteInterval = 0.5 * minute; 
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // prevent multiple intervals from being set
  const topic = "Intermediate Microeconomics";

  const initialMessages : Message[] = [
    {
      id: '0',
      role: 'system',
      content: `
      You are a helpful assistant tasked with generating notes for a live lecture.
      You will be given transcript segments and existing lecture notes, synthesize only the new sections or those requiring updates. Adhere to a clear structure, and ensure conciseness. Do not regenerate content that remains unchanged.
      Stick to a structured, concise format. Do NOT rehash unchanged content, instead indicate the revisions to seamlessly integrate with existing notes. Your goal is streamlined efficiency.
      This revision prioritizes efficiency, focusing on generating only the necessary content.
      `
    }
  ];

  const { messages, append } = useChat({ 
    api: '/api/openai',
    initialMessages: initialMessages,
   });

  // Splits transcript based on nearest end of a sentence and 30 seconds interval.
  // function splitTranscriptByInterval(transcript: string, startTime: number, lastPos: number) {
  //   const segments: string[] = [];
  //   const interval = 30000; // 30 seconds in milliseconds
  //   let nextTime = startTime + interval;

  //   const newTranscript = transcript.slice(lastPos); // Only consider new portion

  //   newTranscript.split('. ').forEach((sentence: string, i: number, arr: string[]) => {
  //     const currentTime = Date.now();
  //     if (currentTime >= nextTime || i === arr.length - 1) {
  //       segments.push(transcript.slice(lastPos, lastPos + sentence.length + 1)); 
  //       lastPos += sentence.length + 1;
  //       nextTime += interval;
  //     }
  //   });

  //   return [segments, lastPos];
  // }

  // update the transcript displayed on the page
  useEffect(() => {
    transcriptRef.current = finalTranscript;
    if (transcriptRef.current.length > 0 && lectureStartTime !== null) {
      // check if it has been at least 30 seconds since the last timestamp
      const currentTime = Date.now();
      if (currentTime - lectureStartTime - lastTimeStamp.current >= timeStampInterval) {
        const minutes = Math.floor((currentTime - lectureStartTime) / minute).toString().padStart(2, '0');
        const seconds = Math.floor(((currentTime - lectureStartTime) % minute) / second).toString().padStart(2, '0');
        const timeString = `(${minutes}:${seconds})`;
        lastTimeStamp.current = lastTimeStamp.current + timeStampInterval;

        const newTranscriptSegment = transcriptRef.current.slice(lastTranscriptIndex.current);
        lastTranscriptIndex.current = transcriptRef.current.length;
        setDisplayTranscript(prevDisplay => {
          return prevDisplay + newTranscriptSegment + '\n' + timeString + '\n';
        });
      } else {
        const newTranscriptSegment = transcriptRef.current.slice(lastTranscriptIndex.current);
        lastTranscriptIndex.current = transcriptRef.current.length;
        setDisplayTranscript(prevDisplay => {
          return prevDisplay + newTranscriptSegment;
        });
      }
    } 
  }, [finalTranscript]);

  

  useEffect(() => {
    // concatentate all messages from the assistant into one string separated by newlines
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    const notes = assistantMessages.map(msg => msg.content).join('\n');
    notesRef.current = notes;
    setDisplayNotes(notesRef.current);

  }, [messages]);

  // update the notes on interval
  useEffect(() => {
    console.log(`isListening: ${isListening}`);

    // If the interval is already active, we simply return.
    if (intervalRef.current) return;

    if (isListening && lectureStartTime === null) {
      
      const startTime = Date.now();
      intervalRef.current = setInterval(async () => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime;

        const partialTranscript = transcriptRef.current.slice(transcriptIndexRef.current);
        transcriptIndexRef.current = Math.max(partialTranscript.length - transcriptBacktrackIndex, 0);

        // console.log(`notes: ${notesRef.current}`);
        // console.log(`transcript: ${partialTranscript}`);

        if (timeElapsed >= noteInterval) {
          const newMessage : CreateMessage = {
            role: 'user',
            content: createPrompt(partialTranscript, notesRef.current, noteInterval, topic)
          };
          append(newMessage);
        }
      }, noteInterval);

      setLectureStartTime(prev => {
        if (prev === null) {
          console.log(`lectureStartTime: ${startTime}`);
          return startTime;
        } else {
          return prev;
        }
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isListening]);
 
  // create prompt using transcript and notes
  const createPrompt = (transcript: string, notes: string, transcriptInterval: number, topic: string) => {
    return `
    Given a segment of the transcript from a lecture on ${topic} and the existing lecture notes generated previously, produce only the new sections or updates required. Concentrate on:

    - Incorporating new main ideas and essential details.
    - Preserving a hierarchical format by using headings, subheadings, bullet points, and numbered lists where appropriate.
    - Using succinct language.
    - Emphasis on new formulas, examples, or references, marking them distinctively.
    - Only present new or fully revised sections. Ensure integration is smooth and free of redundancy.
    - Indication of revisions to previous sections, without regenerating the entire section.
    
    ---
    
    **Lecture Notes Generated so far**:
    ${notes || 'No notes generated yet.'}
    ---
    
    **New Transcript Segment**:
    ${transcript}
    `
  }

  // handlers for starting and stopping the speech recognition and note taking
  const startListening = () => {
    // checks if browser supports speech recognition
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      console.log('Speech recognition started.')
      return true
    } else {
      console.log("Err: Browser doesn't support speech recognition.")
      return false
    }
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    setLectureStartTime(null);
    console.log('Speech recognition stopped.')
    return false
  }

  const handleStartStop = () => {
    if (isListening) {
      setIsListening(stopListening())
    } else {
      setIsListening(startListening())
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.textDisplay}>
          Transcript:
          <p>
            {displayTranscript}
          </p>
        </div>
        <div className={styles.textDisplay}>
          Notes:
          <p>
            {displayNotes}
          </p>
        </div>
      </main>
      <div className={styles.navbar}>
        <div className={`${styles.navItem} ${styles.textButton}`} style={{right: "1rem"}} onClick={handleStartStop}>
          {isListening ? 'Stop' : 'Start'}
        </div>
      </div>
    </div>
  )
}


// TODO:
// - add icon buttons (start/stop, take notes, copy notes, etc.)
// - adjust propmts to generate diffs and not full notes to reduce token counts
// - add time stamps to the transcript and notes, similar to zoom (line numbers esk thing)
// - add database to store transcript (remove dependency on memory)
// - add auth and user accounts and storing notes
// - textbox for input class, when next note is, generate notes now
// - add time stamps to transcript on display
// - on stop, generate notes for the rest of the transcript, and then takes all the notes and generates a file from gpt-4 