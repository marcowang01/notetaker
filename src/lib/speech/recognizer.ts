'use client'

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useState, useCallback, useRef } from 'react';
import useAppStore from "@/stores/appStore";
import { SpeechConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';
import { getTokenOrRefresh } from './token';

function useAzureRecognizer() {
  const transcript = useAppStore(state => state.transcript);
  const setTranscript = useAppStore(state => state.setTranscript); 
  const setDisplayTranscript = useAppStore(state => state.setDisplayTranscript);
  const setIsListening = useAppStore(state => state.setIsListening);
  const [recognizer, setRecognizer] = useState<sdk.SpeechRecognizer | null>(null);

  const transcriptRef = useRef(transcript);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const initRecognizer = useCallback(async () => {
    const tokenObj = await getTokenOrRefresh();
    const authToken = tokenObj.authToken;
    const region = tokenObj.region;

    if (!authToken || !region) {
      console.error('No authorization token or region found. Cannot initialize recognizer.');
      return;
    }

    const speechConfig = SpeechConfig.fromAuthorizationToken(authToken, region);
    speechConfig.speechRecognitionLanguage = 'en-US';
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const newRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
  
    newRecognizer.recognizing = (s, e) => {
      setDisplayTranscript(transcriptRef.current + ' ' + e.result.text);
    };

    newRecognizer.recognized = (s, e) => {
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        const newTranscript = transcriptRef.current + ' ' + e.result.text;
        setTranscript(newTranscript);
        setDisplayTranscript(newTranscript);
        console.log(newTranscript);
      }
    };

    setRecognizer(newRecognizer);
    console.log('Recognizer initialized.');
  }, []);


  const startRecognizer = useCallback(() => {
    if (!recognizer) {
      throw new Error('No recognizer found.');
    } else {
      recognizer.startContinuousRecognitionAsync(
        () => setIsListening(true),
        (err) => console.error("error on start" + err)
      );
    }
  }, [recognizer]);

  const stopRecognizer = useCallback(() => {
    if (!recognizer) {
      throw new Error('No recognizer found.');
    } else {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          setIsListening(false);
        },
        (err) => console.error("error on stop" + err)
      );
    }
  }, [recognizer]);

  return { initRecognizer, startRecognizer, stopRecognizer };
}

export default useAzureRecognizer;
