import apiAccountRequests from '@/apiRequests/account';
import Profile from '@/app/account/profile';
import { cookies } from 'next/headers';
import React from 'react';

export default async function MeProfile() {
  // const cookieStore = cookies();
  // const sessionToken = cookieStore.get('sessionToken');

  // await apiAccountRequests.me(sessionToken?.value ?? '');
  return (
    <div>
      <h1>Profile</h1>
      <Profile />
    </div>
  );
}
