'use client';

import apiAuthRequest from '@/apiRequests/auth';
import { clientSessionToken } from '@/lib/http';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Logout() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get('sessionToken');
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const signal = controller.signal;
    if (sessionToken === clientSessionToken.value) {
      apiAuthRequest
        .logoutFromNextClientToServer(true, signal)
        .then(() => {
          clearTimeout(timeoutId);
          router.push(`/login?redirectForm=${pathname}`);
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.error('Yêu cầu đã bị hủy');
          } else {
            console.error('Đã xảy ra lỗi khi đăng xuất:', error);
          }
        });
    }
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [sessionToken, router, pathname]);
  return <div>Logout</div>;
}
