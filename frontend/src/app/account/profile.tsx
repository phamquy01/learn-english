'use client';

import apiAccountRequests from '@/apiRequests/account';
import React, { useEffect } from 'react';

export default function Profile() {
  useEffect(() => {
    const fetchApi = async () => {
      const result = await apiAccountRequests.meClient();

      console.log(result);
    };
    fetchApi();
  }, []);
  return <div>Profile</div>;
}
