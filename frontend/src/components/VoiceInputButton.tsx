import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import { AppLanguage } from '../types/report';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: AppLanguage;
  label?: string;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  language = 'en',
  label = 'Voice Input',
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'ur-roman' ? 'ur-PK' : 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setErrorMessage(`Voice error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please try Google Chrome or MS Edge.');
      return;
    }

    setErrorMessage(null);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm border ${
          isListening
            ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
            : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
        }`}
        title={isListening ? 'Click to stop listening' : 'Click to dictate text via microphone'}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-rose-600 animate-bounce" />
            <span>Listening... ({language === 'ur-roman' ? 'Urdu' : 'English'})</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-blue-600" />
            <span>{label}</span>
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
          </>
        )}
      </button>
      {errorMessage && (
        <span className="text-[10px] text-rose-500 mt-1 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {errorMessage}
        </span>
      )}
    </div>
  );
};
