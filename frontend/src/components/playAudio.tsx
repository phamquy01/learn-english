'use client';
import { Button } from '@/components/ui/button';
import { Volume2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { set } from 'zod';

export default function PlayAudio({
  language,
  text,
}: {
  language: string;
  text: string;
}) {
  const playAudio = async () => {
    const turnOn = window.speechSynthesis.speaking;
    const synth = window.speechSynthesis;
    if (!text || !synth) return;
    const wordsToSay = new SpeechSynthesisUtterance(text);
    wordsToSay.lang = language;
    if (turnOn === true) {
      synth.cancel();
      return;
    }
    synth.speak(wordsToSay);
  };
  return (
    <Button variant="ghost" type="button" onClick={playAudio} disabled={!text}>
      <Volume2Icon size={18} className="font-bold cursor-pointer" />
    </Button>
  );
}
