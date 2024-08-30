'use client';
import { Mic, MicIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { record, set } from 'zod';

export const mimeType = 'audio/webm';

export default function RecordAudio({
  uploadAudio,
}: {
  uploadAudio: (audio: Blob) => void;
}) {
  const { pending } = useFormStatus();
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const getMicroPhonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert('MediaRecorder is not supported in your browser');
    }
  };

  const startRecording = async () => {
    if (stream === null || pending) return;
    setRecordingStatus('recording');

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localChunks.push(event.data);
    };
    setAudioChunks(localChunks);
  };

  const stopRecording = async () => {
    if (mediaRecorder.current === null || pending) return;

    setRecordingStatus('inactive');
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  };

  useEffect(() => {
    getMicroPhonePermission();
  }, []);
  return (
    <div
      className={`flex items-center group text-blue-500 cursor-pointer border rounded-md w-fit px-3 py-2 mb-5 ${
        recordingStatus === 'recording'
          ? 'bg-red-500 text-white'
          : 'hover:bg-[#E7F0FE]'
      }`}
    >
      <MicIcon
        strokeWidth={1.5}
        fontSize={16}
        className="group-hover:underline font-medium cursor-pointer"
      />
      {!permission && (
        <button onClick={getMicroPhonePermission}>get Microphone</button>
      )}
      {pending && <p>Translating...</p>}

      {permission && recordingStatus === 'inactive' && !pending && (
        <button
          onClick={startRecording}
          className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
          Speak
        </button>
      )}

      {recordingStatus === 'recording' && (
        <button
          onClick={stopRecording}
          className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
          Stop
        </button>
      )}
    </div>
  );
}
