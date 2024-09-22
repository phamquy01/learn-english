'use client';
import { Mic, MicIcon } from 'lucide-react';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function RecordAudio({
  uploadAudio,
}: {
  uploadAudio: (text: string) => void;
}) {
  const { pending } = useFormStatus();
  const [recordingStatus, setRecordingStatus] = useState<string>('inactive');

  const handleVoice = (text: string) => {
    const handledText = text.toLowerCase();
    if (handledText) {
      uploadAudio(handledText);
    }
  };

  const startRecording = (e: any) => {
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
        console.log('result', e);
        const text = e.results[0][0].transcript;

        handleVoice(text);
      };
    }
  };

  return (
    <div
      className={`flex items-center group text-blue-500 cursor-pointer border rounded-md w-fit px-3 py-2 mb-5 `}
    >
      <button onClick={(e) => startRecording(e)}>
        <div
          className={`${
            recordingStatus === 'inactive' ? 'inline-block' : 'hidden'
          }`}
        >
          <MicIcon strokeWidth={3} fontSize={16} />
        </div>
        <span
          className={`${
            recordingStatus === 'recording' ? 'inline-block' : 'hidden'
          } w-3 h-3 bg-[#e22d2d] rounded-full pulse`}
        ></span>
      </button>
    </div>
  );
}
