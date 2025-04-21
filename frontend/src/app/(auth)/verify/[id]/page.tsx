import { VerifyForm } from '@/app/(auth)/verify/[id]/VerifyForm';
import React from 'react';

export default function Verifycation({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Verification Code
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter the 16-digit code sent to your email address.
          </p>
        </div>
        <VerifyForm id={id} />
      </div>
    </div>
  );
}
