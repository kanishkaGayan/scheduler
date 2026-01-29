import { FC, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}

export const Alert: FC<AlertProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[type];

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }[type];

  const icon = type === 'success' ? <Check size={20} /> : <X size={20} />;

  return (
    <div
      className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} shadow-lg z-50 animate-slide-in`}
    >
      <div className={`flex-shrink-0 ${iconColor}`}>{icon}</div>
      <p className={`${textColor} font-medium text-sm`}>{message}</p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${textColor} hover:opacity-75 transition-opacity`}
      >
        <X size={16} />
      </button>
    </div>
  );
};
