'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useFormStatus } from 'react-dom';

export default function ButtonSubmit({ disable }: { disable: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={disable || pending}
      className="bg-blue-500 hover:bg-blue-600 w-full lg:w-fit"
    >
      {pending ? 'Trasnlating...' : 'Translate'}
    </Button>
  );
}
