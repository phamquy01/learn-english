import { ModeToggle } from '@/components/toggle-theme';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <div className="flex">
      <Button variant="outline">
        <Link href="/register">Register</Link>
      </Button>
      <Button variant="outline">
        <Link href="/login">Login</Link>
      </Button>
      <ModeToggle />
    </div>
  );
}
