'use client';

import apiAuthRequest from '@/apiRequests/auth';
import { clientAccessToken } from '@/lib/http';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Logout() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('accessToken');
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const signal = controller.signal;
    if (accessToken === clientAccessToken.value) {
      apiAuthRequest
        .logoutFromNextClientToServer(true, signal)
        .then(() => {
          clearTimeout(timeoutId);
          router.push(`/login?redirectForm=${pathname}`);
          router.push(`/login`);
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
  }, [accessToken, router, pathname]);
  return <div>Logout</div>;
}
