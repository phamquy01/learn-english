'use client';
import React, { createContext, useContext } from 'react';

const appContext = createContext({
  sessionToken: '',
  setSessionToken: (sessionToken: string) => {},
});

export const useAppContext = () => {
  const context = useContext(appContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }

  return context;
};

export default function AppProvider({
  children,
  initialSessionToken = '',
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  const [sessionToken, setSessionToken] = React.useState(initialSessionToken);

  return (
    <appContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </appContext.Provider>
  );
}
