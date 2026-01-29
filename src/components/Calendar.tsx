import { FC, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Task } from '../types';
import { FullCalendarModal } from './FullCalendarModal';

interface CalendarProps {
  tasks: Task[];
  selectedDate?: Date | null;
  onSelectDate: (date: Date) => void;
}

export const Calendar: FC<CalendarProps> = ({ tasks, selectedDate, onSelectDate }) => {
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">{monthName}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFullCalendarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Open full calendar"
          >
            <Maximize2 size={20} className="text-gray-600" />
          </button>
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
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

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateObj)}
              disabled={false}
              className={`p-2 rounded-lg text-sm font-medium transition-colors relative ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : isToday
                    ? 'bg-blue-100 text-blue-900 border-2 border-blue-400'
                    : isPast
                      ? 'text-gray-500 opacity-60 hover:bg-gray-100'
                      : 'hover:bg-gray-100 text-gray-700'
              }`}
              title={`${tasksForDay.length} task(s)`}
            >
              {day}
              {tasksForDay.length > 0 && (
                <div className="absolute bottom-1 right-1 flex gap-0.5">
                  {hasHighPriority && (
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                  {hasMediumPriority && (
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  )}
                  {!hasHighPriority && !hasMediumPriority && (
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-2">Legend:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Low Priority</span>

      {/* Full Calendar Modal */}
      <FullCalendarModal
        isOpen={isFullCalendarOpen}
        onClose={() => setIsFullCalendarOpen(false)}
        tasks={tasks}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 border-2 border-blue-400" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};
