import { FC, useRef, useEffect, useState } from 'react';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';

interface TaskOptionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export const TaskOptionsMenu: FC<TaskOptionsMenuProps> = ({
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        title="Options"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50 rounded-t-lg"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 rounded-b-lg border-t border-gray-200"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
