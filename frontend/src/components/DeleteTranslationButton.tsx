'use client';
import DeleteTranslation from '@/actions/deleteTranslation';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import React from 'react';

export default function DeleteTranslationButton({
  userId,
  translationId,
}: {
  userId: string;
  translationId: string;
}) {
  const deleteTraslationAction = DeleteTranslation.bind(
    null,
    userId,
    translationId
  );
  return (
    <form action={deleteTraslationAction}>
      <Button
        type="submit"
        variant="outline"
        size="icon"
        className="border-red-500 text-red-500 hover:bg-red-400 hover:text-white"
      >
        <TrashIcon fontSize={16} />
      </Button>
    </form>
  );
}
