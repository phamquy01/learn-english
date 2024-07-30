'use client';

import apiUserRequests from '@/apiRequests/user';
import envConfig from '@/config';
import { clientSessionToken } from '@/lib/http';
import React, { use, useEffect } from 'react';

export default function Profile() {
  useEffect(() => {
    const fetchApi = async () => {
      const result = await apiUserRequests.meClient();
      console.log('result', result);
    };
    fetchApi();
  }, []);
  return <div>Profile</div>;
}
