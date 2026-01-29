import { FC } from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

interface FilterSortControlsProps {
  sortBy: 'deadline' | 'priority' | 'title';
  filterStatus: 'All' | 'Pending' | 'In-Progress' | 'Completed';
  itemsPerPage: number;
  onSortChange: (sort: 'deadline' | 'priority' | 'title') => void;
  onFilterChange: (status: 'All' | 'Pending' | 'In-Progress' | 'Completed') => void;
  onItemsPerPageChange: (items: number) => void;
}

export const FilterSortControls: FC<FilterSortControlsProps> = ({
  sortBy,
  filterStatus,
  itemsPerPage,
  onSortChange,
  onFilterChange,
  onItemsPerPageChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            {(['deadline', 'priority', 'title'] as const).map((option) => (
              <button
                key={option}
                onClick={() => onSortChange(option)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  sortBy === option
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div className="flex gap-2">
            {(['All', 'Pending', 'In-Progress', 'Completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => onFilterChange(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-gray-700">Show:</span>
          <div className="flex gap-2">
            {[10, 30, 50, -1].map((count) => (
              <button
                key={count}
                onClick={() => onItemsPerPageChange(count)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  itemsPerPage === count
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count === -1 ? 'All' : count}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
