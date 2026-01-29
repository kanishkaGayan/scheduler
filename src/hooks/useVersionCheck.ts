import { useState, useEffect } from 'react';

interface VersionInfo {
  version: string;
  releaseDate: string;
  changelog: string[];
}

const CURRENT_VERSION = '1.0.0';
const VERSION_CHECK_URL = '/version.json';
const CHECK_INTERVAL = 1000 * 60 * 30; // Check every 30 minutes

export const useVersionCheck = () => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [newVersion, setNewVersion] = useState<VersionInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);
      const response = await fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`);
      const versionInfo: VersionInfo = await response.json();

      if (versionInfo.version !== CURRENT_VERSION) {
        setHasUpdate(true);
        setNewVersion(versionInfo);
        console.log('[Version] New version available:', versionInfo.version);
      } else {
        console.log('[Version] App is up to date');
      }
    } catch (error) {
      console.error('[Version] Failed to check for updates:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check on mount
    checkForUpdates();

    // Check periodically
    const interval = setInterval(checkForUpdates, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const applyUpdate = () => {
    // Clear cache and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    window.location.reload();
  };

  return { hasUpdate, newVersion, isChecking, applyUpdate, checkForUpdates };
};
