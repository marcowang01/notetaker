'use client'

import { useEffect, useState, useRef, ChangeEvent } from 'react'
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useChat, Message, CreateMessage } from 'ai/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faPlay, faPause, faEarListen, faEdit } from '@fortawesome/free-solid-svg-icons';

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

  const [lectureStartTime, setLectureStartTime] = useState<number | null>(null);
  const second = 1000;
  const minute = 60 * second;
  const noteInterval = 3 * minute; 
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // prevent multiple intervals from being set
  const [topic, setTopic] = useState('');

  const initialMessages : Message[] = [
    {
      id: '0',
      role: 'system',
      content: `
      You are a helpful assistant tasked with generating notes for a live lecture.
      You will be given transcript segments and existing lecture notes, synthesize only the new sections or those requiring updates. Adhere to a clear structure, and ensure conciseness. Do not regenerate content that remains unchanged.
      Stick to a structured, concise format. Do NOT rehash unchanged content, instead indicate the revisions to seamlessly integrate with existing notes. Your goal is streamlined efficiency.
      This revision prioritizes efficiency, focusing on generating only the necessary content.
      Note that the transcription may mishear technical terms or miss words entirely. You may need to correct the transcript to ensure the notes are accurate.
      `
    }
  ];

  const { messages, append } = useChat({ 
    api: '/api/openai',
    initialMessages: initialMessages,
   });

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
    Given the most recent segment of the transcript from a lecture on ${topic} and the existing lecture notes generated previously, produce only the new sections or updates required. Concentrate on:

    - Incorporating new main ideas and essential details.
    - Preserving a hierarchical format by using headings, subheadings, bullet points, and numbered lists where appropriate.
    - Using succinct language.
    - Emphasis on new formulas, examples, or references, marking them distinctively.
    - Only present new or fully revised sections. Ensure integration is smooth and free of redundancy. Do not make additional comments on unchanged content.
    - Indication of revisions to previous sections, without regenerating the entire section.

    ---
    
    **Lecture Notes Generated so far**:
    ${notes || 'No notes generated yet.'}
    ---
    
    **New Transcript Segment**:
    ${transcript || 'No new transcript segment.'}

    ---
    `
  }

  // handlers for starting and stopping the speech recognition and note taking
  const startListening = () => {
    // checks if topic is empty
    if (topic.length === 0) {
      console.log("Err: Topic is empty.")
      return false
    }
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

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(function() {
      console.log('Content copied to clipboard successfully!');
    }, function(err) {
      console.error('Could not copy content: ', err);
    });
  }

  // Handler for input changes
  const handleTopicInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTopic(e.target.value);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.textDisplay}>
          Transcript:
          <div onClick={() => handleCopy(transcriptRef.current)} className={styles.button}>
            <FontAwesomeIcon icon={faCopy} />
          </div>
          <p>
            {displayTranscript}
          </p>
        </div>
        <div className={styles.textDisplay}> 
          Notes:
          <div onClick={() => handleCopy(displayNotes)} className={styles.button}>
            <FontAwesomeIcon icon={faCopy} />
          </div>
          <p>
            {displayNotes}
          </p>
        </div>
      </main>
      <div className={styles.navbar}>
        <input 
          className={styles.navItem}
          placeholder='Enter topic here'
          value={topic}
          onChange={handleTopicInputChange}
          disabled={isListening}
        />
        <div className={`${styles.navItem} ${styles.textButton}`} onClick={handleStartStop}>
          {isListening ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
        </div>
        <div className={`${styles.navItem} ${styles.textButton}`}>
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div className={`${styles.navItem}`}>
          <FontAwesomeIcon icon={faEarListen} />{`: ...${transcript.slice(-50)}`}
        </div>
      </div>
    </div>
  )
}


// TODO:
// - textbox for input topic, and generate notes immediately 
// - automatically summarize transcript on token count exceed limit (should keep a running summary regardless of notes generation) can trim summary for shorter context
//    - prompt: summary + recent transcript + existing notes ==> a set of updated notes
// - adjust propmts to generate diffs and not full notes to reduce token counts
// - add database to store transcript (remove dependency on memory)
// - add auth and user accounts and storing notes
// - add time stamps to transcript on display
// - on stop, generate notes for the rest of the transcript, and then takes all the notes and generates a file from gpt-4 
// - add ability to save notes to file
// - main feature: ask what is going on (highlight terms that can be expanded on, use guidance or function calling) [use a different model for this?]
// - at the end, use GPT-3.5 to generate a summary ==> GPT 4 to format into notes (contains definitions, key concepts and examples)
// - fine tune llama on textbook? 
// UI: auto scroll, add topic input box, fix transcript timestamp new line, download button for notes and running summary
// drop down for save and copy options