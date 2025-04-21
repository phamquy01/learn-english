'use client';
import React, { useEffect, useState } from 'react';
import ReactTimeAgo from 'react-timeago';

export default function TimeAgo({ date }: { date: string }) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true);
  }, []);

  if (!rendered) {
    return null; // Hoặc một trạng thái loading
  }
  return <ReactTimeAgo date={date} live={false} />;
}
