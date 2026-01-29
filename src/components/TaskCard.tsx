import { FC } from 'react';
import { Task } from '../types';
import { TimeBadge } from './TimeBadge';
import { TaskOptionsMenu } from './TaskOptionsMenu';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
}

const getPriorityColor = (priority: 'High' | 'Medium' | 'Low'): string => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const TaskCard: FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {/* Priority Badge */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority} Priority
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Time Badge */}
          <TimeBadge deadline={task.deadline} />
          {/* Options Menu */}
          <TaskOptionsMenu
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
          />
        </div>
      </div>

      {/* Body */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{task.title}</h3>
        <p className="text-gray-500 text-sm truncate">{task.description}</p>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex items-center gap-3">
          <label htmlFor={`status-${task.id}`} className="text-sm font-medium text-gray-700 min-w-fit">
            Status:
          </label>
          <select
            id={`status-${task.id}`}
            value={task.status}
            onChange={(e) => onStatusChange?.(task.id, e.target.value as Task['status'])}
            className={`flex-1 px-3 py-2 rounded-md border-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              task.status === 'Completed'
                ? 'border-green-500 bg-green-50 text-green-800'
                : task.status === 'In-Progress'
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-300 bg-gray-50 text-gray-800'
            }`}
          >
            <option value="Pending">Pending</option>
            <option value="In-Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Due Date */}
        <p className="text-xs text-gray-500 text-center">
          Due: {formatDate(task.deadline)}
        </p>
      </div>
    </div>
  );
};
