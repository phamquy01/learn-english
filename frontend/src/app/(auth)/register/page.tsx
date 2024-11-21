import { RegisterForm } from '@/app/(auth)/register/register-form';
import Link from 'next/link';
import React from 'react';

export default function Register() {
  return (
    <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-muted-foreground"
            >
              start your free trial
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
