'use client'

import { useEffect, useState, useRef, ChangeEvent } from 'react'
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useChat, Message, CreateMessage } from 'ai/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faPlay, faPause, faEarListen, faEdit, faClock } from '@fortawesome/free-solid-svg-icons';
import {
  summarySystemPrompt,
  summaryUserPrompt,
  finalNoteSystemPrompt,
  finalNoteUserPrompt,
  customSystemPrompt,
  customUserPrompt
} from '../util/prompts'


import styles from './page.module.css'
import next from 'next';

export default function Home() {
  
  const { transcript, finalTranscript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  const transcriptRef = useRef(transcript);
  const transcriptIndexRef = useRef(0);
  const transcriptBacktrackIndex = 2000; // backtrack ~500 tokens
  const transcriptChunkLength = 6000; // 2k tokens per chunk
  const lastTranscriptIndex = useRef(0); // for generating time stamps
  const lastTimeStamp = useRef(0); // for generating time stamps
  const timeStampInterval = 30000; // 30 seconds in milliseconds

  const notesRef = useRef('');
  const summaryRef = useRef('');
  const [customQuery, setCustomQuery] = useState('What are the top five key takeaways from the last few minutes of the lecture?'); // query for custom notes
  const [displaySummary, setDisplaySummary] = useState(''); // display summary of transcript [in progress]
  const [displayNotes, setDisplayNotes] = useState(''); // display notes from custom interactions
  const [displayTranscript, setDisplayTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false); // prevent multiple notes from being generated at once

  const [lectureStartTime, setLectureStartTime] = useState<number | null>(null);
  const second = 1000;
  const minute = 60 * second;
  
  const [topic, setTopic] = useState('');

//   const testMessage = `
//   She left her job at the Fed. She was not renewed when she was out, which was a travesty. Fantastic job. You may know why she wasn't renewed. The president at the time felt that she was too short to be the head of the Federal Reserve. More on that soon. Alright, so the Fed policymakers, they want a level of output and they want inflation rate and all. We talked about the TH section.
// (00:33) And. And so we talked about like a loss. The nerdy thing then these slides are bunch of maths would look at it basically. If we're here. That's zero. That's the best we can do is to zero. If we're on for that, it's a negative. So we're losing it. We're offense. It's a loss function. The best we can do is no loss.
// (01:00) If we're somewhere off. Better value. Our loss function gets worse the farther we get from that point. So that's the best. That's the happiest we can be. And they were less happy, less happy, less happy. And generally going to go with the balance loss function. Being off on inflation as much as we hate being offline. That's just kind of math for circle is much easier than the math for other shapes.
// (01:31) That's why. The great economist.  
//   `
//   useEffect(() => {
//     setDisplayTranscript(testMessage);
//     setDisplayNotes(testMessage);
//   }, []);

  const onFinish = (message: Message) => {
    console.log('Chat generation finished with message: ', message);
    setIsGenerating(false);
  }

  const onError = (err: Error) => {
    console.log('Chat generation error: ', err);
    setIsGenerating(false);
  }

  const { messages: summaryMessages, append: summaryAppend } = useChat({ 
    api: '/api/openai',
    initialMessages: [
      {
        id: '0',
        role: 'system',
        content: summarySystemPrompt()
      }
    ],
    onFinish: onFinish,
    onError: onError
  });

  const { messages: customMessages, append: customAppend } = useChat({ 
    api: '/api/openai',
    initialMessages: [
      {
        id: '0',
        role: 'system',
        content: customSystemPrompt()
      }
    ],
    onFinish: onFinish,
    onError: onError,
  });

  const { messages: finalNoteMessages, append: finalNoteAppend } = useChat({ 
    api: '/api/openai',
    initialMessages: [
      {
        id: '0',
        role: 'system',
        content: customSystemPrompt()
      }
    ],
    onFinish: onFinish,
    onError: onError,
    body: {
      model: 'gpt-4',
    }
  });

  // update the transcript displayed on the page on detecting new speech
  // see if new summary needs to be generated
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
        // display timestamp every 30 seconds
        setDisplayTranscript(prevDisplay => {
          return prevDisplay + newTranscriptSegment + '\n' + timeString + ' ';
        });
      } else {
        const newTranscriptSegment = transcriptRef.current.slice(lastTranscriptIndex.current);
        lastTranscriptIndex.current = transcriptRef.current.length;
        setDisplayTranscript(prevDisplay => {
          return prevDisplay + newTranscriptSegment;
        });
      }

      // check if 4000 tokens have been added since last summary
      if (transcriptRef.current.length - transcriptIndexRef.current > transcriptChunkLength) {
        generateSummary();
      }
    } 
  }, [finalTranscript]);

  // update the running summary on new messages from the assistant
  useEffect(() => {
    const assistantMessages = summaryMessages.filter(msg => msg.role === 'assistant');
    const summary = assistantMessages.map(msg => msg.content).join('\n');
    
    summaryRef.current = summary;
    setDisplaySummary(summaryRef.current);
  }, [summaryMessages]);

    // update the notes displayed on new messages from the assistant
    useEffect(() => {
      // only display the last message from the assistant
      const assistantMessages = customMessages.filter(msg => msg.role === 'assistant');
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
      if (lastAssistantMessage === undefined) {
        return;
      }
      notesRef.current = lastAssistantMessage.content;
      setDisplayNotes(notesRef.current);
    }, [customMessages]);

  // set lecture start time
  useEffect(() => {
    console.log(`isListening: ${isListening}`);

    // generate the running summary on interval
    if (isListening && lectureStartTime === null) {
      const startTime = Date.now();

      setLectureStartTime(prev => {
        if (prev === null) {
          console.log(`lectureStartTime: ${startTime}`);
          return startTime;
        } else {
          return prev;
        }
      });
    }
  }, [isListening]);


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

  const handleGenerateCustom = () => {
    if (isGenerating) {
      console.log('Notes are already being generated.');
      return 
    }
    setIsGenerating(true);
    console.log('Generating summary...');
    // first generate summary
    generateSummary();

    // then generate notes
    const newMessage : CreateMessage = {
      role: 'user',
      content: customUserPrompt(summaryRef.current, topic, customQuery)
    };
    customAppend(newMessage);
  }

  function generateSummary() {
    if (!isGenerating) {
      setIsGenerating(true);
      const partialTranscript = transcriptRef.current.slice(transcriptIndexRef.current);
      // backtrack to include the ~1000 tokens before the current transcript index
      transcriptIndexRef.current = Math.max(transcriptRef.current.length - transcriptBacktrackIndex, 0)

      const newMessage : CreateMessage = {
        role: 'user',
        content: summaryUserPrompt(partialTranscript, summaryRef.current, topic)
      };

      // append to chat
      summaryAppend(newMessage);
    }
  }

  return (
    <div className={styles.mainContainer}>
      <main className={styles.main}>
        <div className={styles.LRContainer}>
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
            Running Summary:
            <div onClick={() => handleCopy(transcriptRef.current)} className={styles.button}>
              <FontAwesomeIcon icon={faCopy} />
            </div>
            <p>
              {displaySummary}
            </p>
          </div>
        </div>
        <div className={styles.LRContainer}>
          <div className={styles.textDisplay}> 
            Notes:
            <div onClick={() => handleCopy(displayNotes)} className={styles.button}>
              <FontAwesomeIcon icon={faCopy} />
            </div>
            <p>
              {displayNotes}
            </p>
          </div>
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
          <FontAwesomeIcon icon={faEdit} onClick={handleGenerateCustom}/>
        </div>
        <div className={`${styles.navItem}`}>
          {transcriptRef.current.length % transcriptChunkLength} / {transcriptChunkLength}
        </div>
        <div className={`${styles.navItem}`}>
          <FontAwesomeIcon icon={faEarListen} />{`: ...${transcript.slice(-50)}`}
        </div>
      </div>
    </div>
  )
}


// TODO:
// 0. auto scroll + text boxes
// 1. add auth
// 2. add gpt4 on final notes icon
// 3. download files icon
// 4. deepgram + custom vocab
// 5. toast notifications (transition to shadcn ?)


// sr improvements:
// - use deepgram 
// - generate vocab list from input topic

// notes improvements:
// - generate running summary of transcript
// - mini chat/easy buttons for generating instant notes
// - pipeline to polish notes at the end (GPT-4? Guidance?)
// llamaindex: https://www.llamaindex.ai/
// private and local gpt, llama cpp and modal
// mistral 7b dolphin: https://huggingface.co/ehartford/dolphin-2.1-mistral-7b



// user + content management:
// - add auth and user accounts and storing notes (clerk?)
// - add database to store summary
// - add database to store topic and vocab list (per user)

// UI improvements:
// - use shadcn ui
// - auto scroll
// - side bar
// - add toasts for notif
// - better scroll bars