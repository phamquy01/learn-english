import { LoginForm } from '@/app/(auth)/login/login-form';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Login() {
  return (
    <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <Image
            src="https://static.vecteezy.com/system/resources/previews/017/300/282/original/login-icon-in-flat-style-people-secure-access-illustration-on-black-round-background-with-long-shadow-effect-password-approved-circle-button-business-concept-vector.jpg"
            alt="Your Company"
            width={100}
            height={100}
            className="mx-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-muted-foreground"
            >
              register for a new account
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
