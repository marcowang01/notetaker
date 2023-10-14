'use client'

import { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

import styles from './page.module.css'

export default function Home() {
  
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  const [speechText, setSpeechText] = useState('');
  const [notes, setNotes] = useState('');

  const [lectureStartTime, setLectureStartTime] = useState<number | null>(null);;
  const minute = 60 * 1000;
  const [noteInterval, setNoteInterval] = useState(0.1 * minute); 

  // update the transcript displayed on the page
  useEffect(() => {
    setSpeechText(transcript);
  }, [transcript]);

  // update the notes on interval
  useEffect(() => {
    if (isListening && lectureStartTime === null) {
      setLectureStartTime(Date.now());
      console.log(`lectureStartTime: ${lectureStartTime}`)
    }

    if (isListening) {
      const interval = setInterval(async () => {
        const currentTime = Date.now();
        const startTime = lectureStartTime as number;
        const timeElapsed = currentTime - startTime;

        if (timeElapsed >= noteInterval) {
          // const result = await axios.post('/api/openai', {
          //   transcript: speechText,
          //   previousNotes: notes,
          // });
          // setNotes(result.data.newNotes);
          setNotes(`This is a new note taken at ${timeElapsed / minute} minutes since the start. The next note will be taken in ${noteInterval / minute} minutes at ${noteInterval / minute + timeElapsed / minute} minutes.`)
        }
      }, noteInterval);
      
      // cleanup
      return () => clearInterval(interval);
    }
  }, [isListening]);

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
    <main className={styles.main}>
      <div className={styles.textDisplay}>
        Transcript:
        <p>
          {speechText}
        </p>
      </div>
      <div className={styles.textDisplay}>
        Notes:
        <p>
          {notes}
        </p>
      </div>
      <div className={styles.textButton} style={{right: "1rem"}} onClick={handleStartStop}>
        {isListening ? 'Stop' : 'Start'}
      </div>
    </main>
  )
}


// TODO:
// - add icon buttons (start/stop, take notes, copy notes, etc.)
// - add time stamps to the transcript and notes, similar to zoom (line numbers esk thing)
// - add database to store transcript (remove dependency on memory)
// - add auth and user accounts and storing notes