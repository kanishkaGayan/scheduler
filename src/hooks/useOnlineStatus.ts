import { useState, useEffect } from 'react';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('[Connectivity] Back online');
      setIsOnline(true);
      setWasOffline(true);
      // Reset wasOffline after a brief moment to allow sync to trigger
      setTimeout(() => setWasOffline(false), 100);
    };

    const handleOffline = () => {
      console.log('[Connectivity] Gone offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
};
