import { RegisterForm } from '@/app/(auth)/register/register-form';
import Profile from '@/app/user/profile';
import envConfig from '@/config';
import { cookies } from 'next/headers';
import React from 'react';

export default async function MeProfile() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/user/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken?.value}`,
    },
  }).then(async (res) => {
    const payload = await res.json();
    const data = {
      status: res.status,
      payload,
    };
    if (!res.ok) {
      throw data;
    }
    return data;
  });
  return (
    <div>
      <h1>Profile</h1>
      <Profile />
    </div>
  );
}
