'use client';
import { Button } from '@/components/ui/button';
import { Mic, MicIcon } from 'lucide-react';
import { useState } from 'react';

export default function RecordAudio({
  uploadAudio,
  text,
}: {
  uploadAudio: (text: string) => void;
  text: string;
}) {
  const [recordingStatus, setRecordingStatus] = useState<string>('inactive');

  const handleVoice = (text: string) => {
    const handledText = text.toLowerCase();
    if (handledText) {
      uploadAudio(handledText);
    }
  };

  const startRecording = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.start();
      setRecordingStatus('recording');

      recognition.onend = () => {
        recognition.stop();
        setRecordingStatus('inactive');
      };

      recognition.onError = (e: any) => {
        console.error(e.error);
      };

      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;

        handleVoice(text);
      };
    }
  };

  return (
    <>
      <Button
        variant="transparent"
        onClick={(e) => startRecording(e)}
        disabled={!!text}
      >
        <div
          className={`${
            recordingStatus === 'inactive' ? 'inline-block' : 'hidden'
          }`}
        >
          <MicIcon
            strokeWidth={2}
            size={16}
            className="font-bold cursor-pointer hover:opacity-50 text-black"
          />
        </div>
        <span
          className={`${
            recordingStatus === 'recording' ? 'inline-block' : 'hidden'
          } w-3 h-3 bg-[#e22d2d] rounded-full pulse`}
        ></span>
      </Button>
    </>
  );
}
