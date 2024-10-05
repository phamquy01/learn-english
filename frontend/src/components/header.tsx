import Menu from '@/components/menu';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React, { use, useEffect } from 'react';

export default function Header({
  accessToken,
}: {
  accessToken?: string | null;
}) {
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
      {accessToken ? (
        <Menu />
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
