import apiAccountRequests from '@/apiRequests/account';
import Profile from '@/app/users/profile';
import { cookies } from 'next/headers';
import React from 'react';

export default async function MeProfile() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');

  await apiAccountRequests.me(accessToken?.value ?? '');
  return (
    <div>
      <h1>Profile</h1>
      <Profile />
    </div>
  );
}
