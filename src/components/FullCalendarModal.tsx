import { FC, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';

interface FullCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  selectedDate?: Date | null;
  onSelectDate: (date: Date) => void;
}

export const FullCalendarModal: FC<FullCalendarModalProps> = ({
  isOpen,
  onClose,
  tasks,
  selectedDate,
  onSelectDate,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(new Date(today));

  // Get tasks by date (handle timezone properly)
  const tasksByDate = new Map<string, Task[]>();
  tasks.forEach((task) => {
    const taskDate = new Date(task.deadline);
    taskDate.setHours(0, 0, 0, 0);
    const dateStr = taskDate.toISOString().split('T')[0];
    if (!tasksByDate.has(dateStr)) {
      tasksByDate.set(dateStr, []);
    }
    tasksByDate.get(dateStr)!.push(task);
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
            <p className="text-xs text-gray-500 mt-1">Click on any date to filter tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600 hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 px-6 py-4 overflow-hidden flex flex-col">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3 flex-shrink-0">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} className="text-center text-sm font-bold text-gray-700 py-2 bg-gray-50 rounded-lg">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 flex-1 content-start">
            {/* Empty cells */}
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Days of month */}
            {days.map((day) => {
              const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              dateObj.setHours(0, 0, 0, 0);
              const dateStr = dateObj.toISOString().split('T')[0];
              const tasksForDay = tasksByDate.get(dateStr) || [];
              const isToday = dateObj.getTime() === today.getTime();
              const isPast = dateObj < today;
              const isSelected =
                selectedDate &&
                new Date(selectedDate).setHours(0, 0, 0, 0) === dateObj.getTime();
              const hasHighPriority = tasksForDay.some((t) => t.priority === 'High');
              const hasMediumPriority = tasksForDay.some((t) => t.priority === 'Medium');
              const hasLowPriority = tasksForDay.some((t) => t.priority === 'Low');

              return (
                <button
                  key={day}
                  onClick={() => {
                    onSelectDate(dateObj);
                    onClose();
                  }}
                  className={`p-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg flex flex-col items-start justify-between border-2 min-h-[80px] ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl'
                      : isToday
                        ? 'bg-blue-50 text-blue-900 border-blue-500 shadow-md'
                        : isPast
                          ? 'text-gray-400 border-gray-200 hover:bg-gray-50'
                          : 'text-gray-800 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  <span className="text-xl font-bold">{day}</span>
                  {tasksForDay.length > 0 && (
                    <div className="w-full space-y-1">
                      <div className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-gray-700'
                      }`}>
                        {tasksForDay.length} task{tasksForDay.length !== 1 ? 's' : ''}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {hasHighPriority && (
                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow" title="High priority" />
                        )}
                        {hasMediumPriority && (
                          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow" title="Medium priority" />
                        )}
                        {hasLowPriority && (
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow" title="Low priority" />
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
