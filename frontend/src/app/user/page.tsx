import apiUserRequests from '@/apiRequests/user';
import { RegisterForm } from '@/app/(auth)/register/register-form';
import Profile from '@/app/user/profile';
import envConfig from '@/config';
import { cookies } from 'next/headers';
import React from 'react';

export default async function MeProfile() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  const result = await apiUserRequests.me(sessionToken?.value ?? '');
  return (
    <div>
      <h1>Profile</h1>
      <Profile />
    </div>
  );
}
