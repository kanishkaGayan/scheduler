import { FC, useState, useEffect } from 'react';
import { Task } from '../types';
import { X } from 'lucide-react';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'> | Task) => Promise<void>;
  isLoading?: boolean;
  editingTask?: Task | null;
}

export const TaskForm: FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  editingTask = null 
}) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    status: 'Pending' as 'Pending' | 'In-Progress' | 'Completed',
  });

  // Set form data when editing
  useEffect(() => {
    if (editingTask) {
      const deadlineStr = editingTask.deadline.toISOString().slice(0, 16);
      setFormData({
        id: editingTask.id,
        title: editingTask.title,
        description: editingTask.description,
        deadline: deadlineStr,
        priority: editingTask.priority,
        status: editingTask.status,
      });
    } else if (isOpen) {
      // Auto-fill with today's date for new tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().slice(0, 16);
      setFormData({
        id: '',
        title: '',
        description: '',
        deadline: todayStr,
        priority: 'Medium',
        status: 'Pending',
      });
    }
  }, [editingTask, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const task: Omit<Task, 'id'> | Task = editingTask
        ? {
            id: formData.id,
            title: formData.title,
            description: formData.description,
            deadline: new Date(formData.deadline),
            priority: formData.priority,
            status: formData.status,
          }
        : {
            title: formData.title,
            description: formData.description,
            deadline: new Date(formData.deadline),
            priority: formData.priority,
            status: formData.status,
          };

      await onSubmit(task);

      // Reset form
      setFormData({
        id: '',
        title: '',
        description: '',
        deadline: '',
        priority: 'Medium',
        status: 'Pending',
      });

      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Complete project report"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add task details..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline *
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={editingTask ? undefined : new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
            {!editingTask && (
              <p className="text-xs text-gray-500 mt-1">Cannot select previous dates</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {isLoading ? (editingTask ? 'Updating...' : 'Creating...') : (editingTask ? 'Update Task' : 'Save Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
