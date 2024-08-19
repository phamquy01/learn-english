import Menu from '@/components/menu';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Header() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  return (
    <header className="flex justify-between items-center px-8 border-b mb-5">
      <div className="flex items-center justify-center h-20">
        <Link href="/">
          <Image
            src="https://links.papareact.com/xgu"
            alt="Logo"
            width={200}
            height={100}
            className="object-contain h-32 cursor-pointer"
          />
        </Link>
      </div>
      {sessionToken ? (
        <div className="flex justify-center items-center">
          <ModeToggle />
          <Menu />
        </div>
      ) : (
        <div>
          <Button variant="ghost">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      )}
    </header>
  );
}