import { useState, useEffect } from 'react';

interface VersionInfo {
  version: string;
  releaseDate: string;
  changelog: string[];
  downloadUrl?: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  body: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

const CURRENT_VERSION = '1.0.11';
// Replace with your GitHub repo
const GITHUB_REPO = 'kanishka-gayan/timekeeper'; // Change this to your repo
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
const CHECK_INTERVAL = 1000 * 60 * 30; // Check every 30 minutes

// Simple version comparison (e.g., "1.0.11" vs "1.0.10")
const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const a = parts1[i] || 0;
    const b = parts2[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
};

export const useVersionCheck = () => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [newVersion, setNewVersion] = useState<VersionInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);
      
      // Check GitHub releases
      const response = await fetch(GITHUB_API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch from GitHub');
      }
      
      const release: GitHubRelease = await response.json();
      const remoteVersion = release.tag_name.replace('v', '').replace(/^v/, '');
      
      // Parse changelog from GitHub release body
      const changelog = release.body
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[-*]\s*/, '').trim());

      // Find AppImage asset
      const appImageAsset = release.assets.find(asset => 
        asset.name.endsWith('.AppImage') || asset.name.includes('TimeKeeper')
      );

      if (compareVersions(remoteVersion, CURRENT_VERSION) > 0) {
        setHasUpdate(true);
        setNewVersion({
          version: remoteVersion,
          releaseDate: release.published_at,
          changelog: changelog.length > 0 ? changelog : ['See GitHub release for details'],
          downloadUrl: appImageAsset?.browser_download_url,
        });
        console.log('[Version] New version available:', remoteVersion);
      } else {
        console.log('[Version] App is up to date:', CURRENT_VERSION);
      }
    } catch (error) {
      console.error('[Version] Failed to check for updates:', error);
      // Fallback to local version.json
      try {
        const response = await fetch(`/version.json?t=${Date.now()}`);
        const versionInfo: VersionInfo = await response.json();
        if (compareVersions(versionInfo.version, CURRENT_VERSION) > 0) {
          setHasUpdate(true);
          setNewVersion(versionInfo);
        }
      } catch (fallbackError) {
        console.error('[Version] Fallback check also failed:', fallbackError);
      }
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
    if (newVersion?.downloadUrl) {
      // Open download link
      window.open(newVersion.downloadUrl, '_blank');
    } else {
      // Clear cache and reload
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      window.location.reload();
    }
  };

  return { hasUpdate, newVersion, isChecking, applyUpdate, checkForUpdates };
};
