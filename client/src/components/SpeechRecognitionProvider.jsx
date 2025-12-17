import { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';

// Lazy import speech recognition to avoid errors
let speechRecognitionModule = null;
let useSpeechRecognition = null;

try {
  // Dynamic import to handle errors gracefully
  import('react-speech-recognition').then((module) => {
    speechRecognitionModule = module;
    useSpeechRecognition = module.useSpeechRecognition;
  }).catch((error) => {
    console.warn('Speech recognition not available:', error);
  });
} catch (error) {
  console.warn('Speech recognition import failed:', error);
}

export function SpeechRecognitionProvider({ children }) {
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }, []);

  return <>{children}</>;
}

