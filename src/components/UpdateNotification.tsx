import { FC } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface UpdateNotificationProps {
  version: string;
  changelog: string[];
  onUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateNotification: FC<UpdateNotificationProps> = ({
  version,
  changelog,
  onUpdate,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border-2 border-indigo-500 max-w-md">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
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
          Version <span className="font-semibold text-indigo-600">{version}</span> is now available!
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

        <button
          onClick={onUpdate}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Update Now
        </button>
      </div>
    </div>
  );
};
