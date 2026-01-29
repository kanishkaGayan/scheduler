import { FC } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectivityStatusProps {
  isOnline: boolean;
  isSyncing: boolean;
}

export const ConnectivityStatus: FC<ConnectivityStatusProps> = ({ isOnline, isSyncing }) => {
  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
        <span className="text-sm font-medium text-blue-900">Syncing...</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <WifiOff className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium text-yellow-900">Offline Mode</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
      <Wifi className="w-4 h-4 text-green-600" />
      <span className="text-sm font-medium text-green-900">Online</span>
    </div>
  );
};
