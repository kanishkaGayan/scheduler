import { FC } from 'react';
import { RefreshCw, X, Download, ExternalLink } from 'lucide-react';

interface UpdateNotificationProps {
  version: string;
  changelog: string[];
  onUpdate: () => void;
  onDismiss: () => void;
  downloadUrl?: string;
}

export const UpdateNotification: FC<UpdateNotificationProps> = ({
  version,
  changelog,
  onUpdate,
  onDismiss,
  downloadUrl,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border-2 border-emerald-500 max-w-md">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">Update Available</h3>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          Version <span className="font-semibold text-emerald-600">{version}</span> is now available on GitHub!
        </p>

        {changelog.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">What's new:</p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              {changelog.slice(0, 3).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onDismiss}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Later
          </button>
          <button
            onClick={onUpdate}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            {downloadUrl ? 'Download' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};
