'use client'

import { useEffect, useState, useRef, ChangeEvent } from 'react'
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Message, CreateMessage } from 'ai/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faPlay, faPause, faEarListen, faWandMagic, faEnvelope, faWandMagicSparkles, faVialCircleCheck, faCircleInfo, faHandPointRight, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link';
import { testEconTranscript, testShortTranscript } from '../util/testTranscripts'
import toast, { Toaster } from 'react-hot-toast';
import {
  summarySystemPrompt,
  summaryUserPrompt,
  finalNoteSystemPrompt,
  finalNoteUserPrompt,
  customSystemPrompt,
  customUserPrompt
} from '../util/prompts'
import useCustomChat  from '../hooks/chat'
import styles from './page.module.css'
import InfoOverlay from './components/infoOverlay';

export default function Home() {
  
  const { transcript, finalTranscript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  const second = 1000;
  const minute = 60 * second;

  const transcriptBacktrackIndex = 400 * 4; // backtrack 300 tokens
  const transcriptChunkLength = 1600 * 4; // 1.0k tokens per chunk
  const timeStampInterval = 30 * second; // 30 seconds in milliseconds

  const transcriptIndexRef = useRef(0);
  const [lectureStartTime, setLectureStartTime] = useState<number | null>(null);
  const lastTranscriptIndex = useRef(0); // for generating time stamps
  const lastTimeStamp = useRef(0); // for generating time stamps

  const notesRef = useRef('');
  const summaryRef = useRef('');
  const transcriptRef = useRef(transcript);
  const notesParagraphRef = useRef<HTMLParagraphElement>(null);
  const summaryParagraphRef = useRef<HTMLParagraphElement>(null);
  const transcriptParagraphRef = useRef<HTMLParagraphElement>(null);
  const [displaySummary, setDisplaySummary] = useState(''); // display summary of transcript [in progress]
  const [displayNotes, setDisplayNotes] = useState(''); // display notes from custom interactions
  const [displayTranscript, setDisplayTranscript] = useState('');

  const isGenerating = useRef(false);
  const shouldGenerateCustom = useRef(false);
  const shouldGenerateFinal = useRef(false);

  
  const [topic, setTopic] = useState('');
  const [customQuery, setCustomQuery] = useState(''); // query for custom notes
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/123')
    }
  })

  const onError = (err: Error) => {
    console.log('Chat generation error: ', err);
    toast.error('open ai api error. chat generation failed.');
    isGenerating.current = false;
  }

  const { messages: summaryMessages, append: summaryAppend } = useCustomChat({
    systemPrompt: summarySystemPrompt(),
    onFinish: onSummaryFinish,
    onError: onError
  })

  const { messages: customMessages, append: customAppend } = useCustomChat({
    systemPrompt: customSystemPrompt(),
    onFinish: onCustomNotesFinish,
    onError: onError
  }) 
  
  const { messages: finalNoteMessages, append: finalNoteAppend } = useCustomChat({
    systemPrompt: finalNoteSystemPrompt(),
    onFinish: onFinalNotesFinish,
    onError: onError
  })

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

  // update the notes displayed on new messages from the assistant
  useEffect(() => {
    // disply all messages from the assistant
    const assistantMessages = finalNoteMessages.filter(msg => msg.role === 'assistant');
    const notes = assistantMessages.map(msg => msg.content).join('\n');

    if (notes === '') {
      return;
    }

    // override custom notes with final notes
    notesRef.current = notes;
    setDisplayNotes(notesRef.current);
  }, [finalNoteMessages]);

  // set lecture start time
  useEffect(() => {
    console.log(`isListening: ${isListening}`);
    if (isListening) {
      toast.success('speech recognition started.');
    } else {
      toast.success('speech recognition stopped.');
    }

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

  // auto scroll to bottom of transcript and notes
  useEffect(() => {
    if (transcriptParagraphRef.current) {
      transcriptParagraphRef.current.scrollTop = transcriptParagraphRef.current.scrollHeight;
    }
  }, [displayTranscript]);
  
  useEffect(() => {
    if (summaryParagraphRef.current) {
      summaryParagraphRef.current.scrollTop = summaryParagraphRef.current.scrollHeight;
    }
  }, [displaySummary]);
  
  useEffect(() => {
    if (notesParagraphRef.current) {
      notesParagraphRef.current.scrollTop = notesParagraphRef.current.scrollHeight;
    }
  }, [displayNotes]);


  // handlers for starting and stopping the speech recognition and note taking
  const startListening = () => {
    // checks if topic is empty
    if (topic.length === 0) {
      console.log("Error: Topic is empty.")
      toast.error('Enter a topic. failed to start.');
      return false
    }
    // checks if browser supports speech recognition
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      console.log('Speech recognition started.')
      return true
    } else {
      console.log("Error: Browser doesn't support speech recognition.")
      toast.error('browser does not support speech recognition.');
      return false
    }
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
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
      toast.error('copy failed. try again.');
    });
  }

  // Handler for input changes
  const handleTopicInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTopic(e.target.value);
  };

  const handleQueryInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setCustomQuery(e.target.value);
  }

  const handleGenerateCustom = () => {
    if (topic.length === 0) {
      console.log("Err: Topic is empty.")
      toast.error('Enter a topic. cannot generate response.');
      return 
    }
    if (customQuery.length === 0) {
      console.log("Err: Query is empty.")
      toast.error('enter a query. cannot generate response.');
      return 
    }
    if (transcriptRef.current.length === 0) {
      console.log("Err: transcript is empty.")
      toast.error('no transcript detected. cannot generate response.');
      return 
    }

    shouldGenerateCustom.current = true;
    const success = generateSummary();
    if (!success) {
      generateCustomNotes();
    }
  }

  const handleGenerateFinal = () => {
    if (topic.length === 0) {
      console.log("Err: Topic is empty.")
      toast.error('Enter a topic. cannot generate notes.');
      return 
    }
    if (transcriptRef.current.length === 0) {
      console.log("Err: transcript is empty.")
      toast.error('no transcript detected. cannot generate notes.');
      return 
    }

    shouldGenerateFinal.current = true;
    const success = generateSummary();
    if (!success) {
      generateFinalNotes();
    }
  }

  const handleContinueFinal = () => {
    if (topic.length === 0) {
      console.log("Err: Topic is empty.")
      toast.error('Enter a topic. cannot continue notes.');
      return 
    }
    if (notesRef.current.length === 0) {
      console.log("Err: Notes is empty.")
      toast.error('no notes detected. cannot continue notes.');
      return 
    }

    shouldGenerateFinal.current = true;
    continueFinalNotes();
  }

  const handleInfoOverlay = () => {
    setShowInfoOverlay(!showInfoOverlay);
  }

  const handleCloseInfoOverlay = () => {
    setShowInfoOverlay(false);
  }

  // generate summary from transcript, returns true if successful
  function generateSummary() {
    // check if there are new transcript segments to generate summary from
    if (transcriptRef.current.length - transcriptIndexRef.current === transcriptBacktrackIndex) {
      console.log('No new transcript segments to generate summary from.');
      return false;
    }

    if (!isGenerating.current) {
      isGenerating.current = true;
      console.log('Generating summary...');

      const partialTranscript = transcriptRef.current.slice(transcriptIndexRef.current);
      // backtrack to include the ~1000 tokens before the current transcript index
      transcriptIndexRef.current = Math.max(transcriptRef.current.length - transcriptBacktrackIndex, 0)

      const newMessage : CreateMessage = {
        role: 'user',
        content: summaryUserPrompt(partialTranscript, summaryRef.current, topic)
      };

      // append to chat
      console.log('New summary message prompt: ', newMessage)
      summaryAppend(newMessage);

      return true
    }
    return false
  }

  function generateCustomNotes() {
    if (isGenerating.current) {
      console.log('Notes are already being generated.');
      toast.error('Currently already generating text. try again later.');
      return 
    }
    isGenerating.current = true;
    console.log('Generating custom notes...');
    // then generate notes
    const newMessage : CreateMessage = {
      role: 'user',
      content: customUserPrompt(summaryRef.current, topic, customQuery)
    };
    console.log('New custom notes message prompt: ', newMessage)
    customAppend(newMessage);
  }

  function generateFinalNotes() {
    if (isGenerating.current) {
      console.log('Notes are already being generated.');
      toast.error('Currently already generating text. try again later.');
      return 
    }
    isGenerating.current = true;
    console.log('Generating final notes...');
    // then generate notes
    const newMessage : CreateMessage = {
      role: 'user',
      content: finalNoteUserPrompt(summaryRef.current, topic)
    };
    console.log('New final notes message prompt: ', newMessage)
    finalNoteAppend(newMessage);
  }

  function continueFinalNotes() {
    if (isGenerating.current) {
      console.log('Notes are already being generated.');
      toast.error('Currently already generating text. try again later.');
      return 
    }
    isGenerating.current = true;
    console.log('Continuing final notes...');
    // then generate notes
    const newMessage : CreateMessage = {
      role: 'user',
      content: 'continue'
    };
    console.log('New final notes continue message prompt: ', newMessage)
    finalNoteAppend(newMessage);
  }

  function onSummaryFinish(message: Message) {
    console.log('Sumamry generation finished with message: ', message);
    isGenerating.current = false;

    if (shouldGenerateCustom.current) {
      shouldGenerateCustom.current = false;
      generateCustomNotes();
    } else if (shouldGenerateFinal.current) {
      shouldGenerateFinal.current = false;
      generateFinalNotes();
    }
  }

  function onCustomNotesFinish(message: Message) {
    console.log('Custom generation finished with message: ', message);
    isGenerating.current = false;
    shouldGenerateCustom.current = false;
  }

  function onFinalNotesFinish(message: Message) {
    console.log('Final note generation finished with message: ', message);
    isGenerating.current = false;
    shouldGenerateFinal.current = false;
  }


  function handleGenerateTestTranscript() {
    if (isGenerating.current) {
      console.log('Notes are already being generated.');
      toast.error('Currently already generating text. try again later.');
      return 
    }
    // transcriptRef.current = testEconTranscript();
    transcriptRef.current = testShortTranscript();
    setDisplayTranscript(transcriptRef.current);
    setTopic('notetaking web app');
    setCustomQuery('Write the top 5 takeaways from the lecture so far.')
  }

  function handleDefaultCustomQuery() {
    if (isGenerating.current) {
      console.log('Notes are being generated. try again later.');
      return
    }
    setCustomQuery('Highlight new facts, examples, formulas and definitions presented in the last few minutes of the lecture. Then, write the top 5 takeaways from the summary.');
  }

  return (
    <div className={styles.mainContainer}>
      <Toaster />
      <InfoOverlay show={showInfoOverlay} onClose={handleCloseInfoOverlay}/>
      <div className={styles.navbar} style={{ justifyContent: "flex-end" }}>
        <div className={`${styles.navItem} ${styles.textButton}`} onClick={handleInfoOverlay}>
          <FontAwesomeIcon icon={faCircleInfo} style={{marginRight: '5px'}}/> {` help`}
        </div>
        <div className={`${styles.navItem} ${styles.textButton}`}>
          {session?.user?.email && 
            <Link href="/api/auth/signout">
              <FontAwesomeIcon icon={faEnvelope} fixedWidth/> {` ${session?.user?.email}`}
            </Link>
          }
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.LRContainer}>
          <div className={styles.textDisplay}>
            Transcript:
            <div onClick={() => handleCopy(transcriptRef.current)} className={styles.button}>
              <FontAwesomeIcon icon={faCopy} />
            </div>
            <p ref={transcriptParagraphRef}>
              {displayTranscript}
            </p>
          </div>
          <div className={styles.textDisplay}>
            Running Summary:
            <div onClick={() => handleCopy(displaySummary)} className={styles.button}>
              <FontAwesomeIcon icon={faCopy} />
            </div>
            <p ref={summaryParagraphRef}>
              {displaySummary}
            </p>
          </div>
        </div>
        <div className={styles.LRContainer}>
          <div className={styles.textDisplay} style={{flex: 2}}> 
            Notes:
            <div onClick={() => handleCopy(displayNotes)} className={styles.button}>
              <FontAwesomeIcon icon={faCopy} />
            </div>
            <p ref={notesParagraphRef}>
              {displayNotes}
            </p>
          </div>
          <div className={styles.textDisplay} style={{flex: 1}}> 
            User Inputs:
            <input 
              className={styles.textInput}
              placeholder='Enter topic here'
              value={topic}
              onChange={handleTopicInputChange}
              disabled={isListening || isGenerating.current}
              style={{flex: 1}}
            />
            <textarea 
              className={styles.textInput}
              placeholder='Enter custom question/instruction here'
              value={customQuery}
              onChange={handleQueryInputChange}
              disabled={isGenerating.current}
              style={{flex: 3}}
            />
            <div className={styles.bottomLeftTextButton}>
              <FontAwesomeIcon icon={faArrowRotateForward} onClick={handleDefaultCustomQuery}/>
            </div>
          </div>
        </div>
      </main>
      <div className={styles.navbar}>
        <div className={`${styles.navItem} ${styles.textButton}`} onClick={handleStartStop}>
          {isListening ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
        </div>
        <div className={`${styles.navItem} ${styles.textButton}`}>
          <FontAwesomeIcon icon={faWandMagic} onClick={handleGenerateCustom}/>
        </div>
        <div className={`${styles.navItem} ${styles.textButton}`}>
          <FontAwesomeIcon icon={faWandMagicSparkles} onClick={handleGenerateFinal}/>
        </div>
        <div className={`${styles.navItem} ${styles.textButton}`}>
          <FontAwesomeIcon icon={faHandPointRight} onClick={handleContinueFinal}/>
        </div>
        <div className={`${styles.navItem} ${styles.textButton}`} onClick={handleGenerateTestTranscript}>
          <FontAwesomeIcon icon={faVialCircleCheck}/>
        </div>
        <div className={`${styles.navItem}`}>
          {transcriptRef.current.length - transcriptIndexRef.current} / {transcriptChunkLength}
        </div>
        <div className={`${styles.navItem}`}>
          <FontAwesomeIcon icon={faEarListen} />{`: ...${transcript.slice(-50)}`}
        </div>
      </div>
    </div>
  )
}


// TODO:
// should display real time and lecture start time?
// 5. toast notifications 
// 5. status bar + spinnig gear + error toasts
// 7. user test (download button)

// 6. use better model 
// 7. multiple chatGPT experts? (fact extraction, high level summary, term correction)

// 7. mvp success --> refactor code + use shadcn ui

// key input:
// - allow users to input GPT-4 key

// sr improvements:
// - use deepgram (less accurate from testing)
// - generate vocab list from input topic

// notes improvements:
// llamaindex: https://www.llamaindex.ai/
// private and local gpt, llama cpp and modal
// mistral 7b dolphin: https://huggingface.co/ehartford/dolphin-2.1-mistral-7b
// fast inference with modal: https://www.andrewhhan.com/2023/10/25/how-i-replaced-my-openai-spend-with-oss-and-modal.html
// use blank tokens for confusing parts (then use gpt4 to fill the gaps at the end)
// modal, anyscale
// error recovery. on error, the transcript index needs to be reset

// user + content management:
// - add database to store summary and store user sessions
// - add database to store topic and vocab list (per user)

// UI improvements:
// - add pages for auth
// - use shadcn ui
// - auto scroll
// - side bar
// - add toasts for notif
// - better scroll bars
// - add tooltips

// code improvements:
// - refactor code into multiple files (navbar, text displays, etc.)
// - better state transitions between generation
// - better testing pipeline and error handling
// - use redux or zustand for state management