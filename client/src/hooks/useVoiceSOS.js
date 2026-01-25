import { useEffect } from 'react';

const useVoiceSOS = (onTrigger) => {
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const command = lastResult[0].transcript.trim().toLowerCase();
      
      if (command.includes('help') || command.includes('emergency')) {
        onTrigger();
      }
    };

    recognition.start();

    return () => recognition.stop();
  }, [onTrigger]);
};

export default useVoiceSOS;
