import { useState, useEffect } from 'react';
import { Task } from './types';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { Calendar } from './components/Calendar';
import { FilterSortControls } from './components/FilterSortControls';
import { Alert } from './components/Alert';
import { ConnectivityStatus } from './components/ConnectivityStatus';
import { UpdateNotification } from './components/UpdateNotification';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useVersionCheck } from './hooks/useVersionCheck';
import { syncQueue } from './utils/syncQueue';
import { getTasks, addTask, updateTask, updateTaskStatus, deleteTask } from './services/taskService';
import type { AlertType } from './components/Alert';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'title'>('deadline');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'In-Progress' | 'Completed'>('All');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>([]);

  // Online status detection
  const { isOnline, wasOffline } = useOnlineStatus();

  // Version check for auto-updates
  const { hasUpdate, newVersion, applyUpdate } = useVersionCheck();
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  // Show update notification when update is available
  useEffect(() => {
    if (hasUpdate && newVersion) {
      setShowUpdateNotification(true);
    }
  }, [hasUpdate, newVersion]);

  // Fetch tasks from Firebase on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        console.log('[App] Fetching tasks from Firebase...');
        const fetchedTasks = await getTasks();
        console.log('[App] Tasks loaded:', fetchedTasks.length, 'tasks');
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error('[App] Failed to fetch tasks:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        const firebaseCode = (err as any)?.code || 'UNKNOWN';
        setError(`Firebase Error (${firebaseCode}): ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Sync queued operations when coming back online
  useEffect(() => {
    const syncQueuedOperations = async () => {
      if (wasOffline && isOnline && !syncQueue.isEmpty()) {
        try {
          setIsSyncing(true);
          console.log('[App] Syncing queued operations...');
          
          const operations = syncQueue.getAll();
          console.log(`[App] Processing ${operations.length} queued operations`);

          for (const op of operations) {
            try {
              switch (op.type) {
                case 'add':
                  await addTask(op.data);
                  console.log(`[App] Synced add operation for task`);
                  break;
                case 'update':
                  await updateTask(op.id, op.data);
                  console.log(`[App] Synced update operation for task ${op.id}`);
                  break;
                case 'statusChange':
                  await updateTaskStatus(op.id, op.data.status);
                  console.log(`[App] Synced status change for task ${op.id}`);
                  break;
                case 'delete':
                  await deleteTask(op.id);
                  console.log(`[App] Synced delete operation for task ${op.id}`);
                  break;
              }
            } catch (err) {
              console.error(`[App] Failed to sync operation ${op.type} for ${op.id}:`, err);
            }
          }

          syncQueue.clear();
          const updatedTasks = await getTasks();
          setTasks(updatedTasks);
          setAlert({ type: 'success', message: `Synced ${operations.length} queued operations` });
          console.log('[App] Sync complete');
        } catch (err) {
          console.error('[App] Sync failed:', err);
          setAlert({ type: 'error', message: 'Failed to sync offline changes' });
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncQueuedOperations();
  }, [wasOffline, isOnline]);

  // Filter and sort tasks
  useEffect(() => {
    let filtered = tasks.filter((task) => {
      // Filter by status
      if (filterStatus !== 'All' && task.status !== filterStatus) {
        return false;
      }

      // Filter by selected date if one is selected
      if (selectedDate) {
        const taskDate = new Date(task.deadline);
        taskDate.setHours(0, 0, 0, 0);
        const selectedDateOnly = new Date(selectedDate);
        selectedDateOnly.setHours(0, 0, 0, 0);
        if (taskDate.getTime() !== selectedDateOnly.getTime()) {
          return false;
        }
      }

      return true;
    });

    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return a.deadline.getTime() - b.deadline.getTime();
        case 'priority':
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, filterStatus, sortBy, selectedDate]);

  // Pagination effect
  useEffect(() => {
    if (itemsPerPage === -1) {
      // Show all items
      setDisplayedTasks(filteredTasks);
      setCurrentPage(1);
    } else {
      // Paginate items
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setDisplayedTasks(filteredTasks.slice(startIndex, endIndex));
    }
  }, [filteredTasks, itemsPerPage, currentPage]);

  // Reset to first page when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, sortBy, selectedDate, itemsPerPage]);

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(filteredTasks.length / itemsPerPage);

  // Check for tasks with tomorrow's deadline
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const upcomingTasks = tasks.filter((task) => {
      if (task.status === 'Completed') return false;
      const taskDate = new Date(task.deadline);
      return taskDate >= tomorrow && taskDate <= tomorrowEnd;
    });

    setTomorrowTasks(upcomingTasks);
  }, [tasks]);

  // Handler to add or update task
  const handleAddTask = async (taskData: Omit<Task, 'id'> | Task) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!isOnline) {
        // Queue operation for offline sync
        if ('id' in taskData) {
          syncQueue.add({ id: taskData.id, type: 'update', data: taskData });
          setAlert({ type: 'info', message: 'Task queued for sync when online' });
          // Update local state optimistically
          setTasks(prevTasks => 
            prevTasks.map(t => t.id === taskData.id ? taskData : t)
          );
        } else {
          const tempId = `temp_${Date.now()}`;
          syncQueue.add({ id: tempId, type: 'add', data: taskData });
          setAlert({ type: 'info', message: 'Task queued for sync when online' });
          // Add to local state with temporary ID
          setTasks(prevTasks => [...prevTasks, { ...taskData, id: tempId } as Task]);
        }
        setEditingTask(null);
        return;
      }

      if ('id' in taskData) {
        // Edit existing task
        console.log('[App] Updating task:', taskData.id);
        await updateTask(taskData.id, taskData);
        console.log('[App] Task updated');
        setAlert({ type: 'success', message: 'Task updated successfully!' });
      } else {
        // Create new task
        console.log('[App] Adding task to Firestore:', taskData);
        const newTaskId = await addTask(taskData);
        console.log('[App] Task added with ID:', newTaskId);
        setAlert({ type: 'success', message: 'Task created successfully!' });
      }

      // Refresh tasks list
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
      setEditingTask(null);
    } catch (err) {
      console.error('[App] Error saving task:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setAlert({ type: 'error', message: `Failed to save task: ${errorMessage}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (!isOnline) {
        // Queue operation for offline sync
        syncQueue.add({ id: taskId, type: 'delete', data: {} });
        setAlert({ type: 'info', message: 'Deletion queued for sync when online' });
        // Remove from local state optimistically
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        return;
      }

      console.log('[App] Deleting task:', taskId);
      await deleteTask(taskId);
      console.log('[App] Task deleted');

      // Refresh tasks list
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
      setAlert({ type: 'success', message: 'Task deleted successfully!' });
    } catch (err) {
      console.error('[App] Error deleting task:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setAlert({ type: 'error', message: `Failed to delete task: ${errorMessage}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      if (!isOnline) {
        // Queue operation for offline sync
        syncQueue.add({ id: taskId, type: 'statusChange', data: { status: newStatus } });
        setAlert({ type: 'info', message: 'Status change queued for sync when online' });
        // Update local state optimistically
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
        );
        return;
      }

      console.log('[App] Changing task status:', taskId, 'to', newStatus);
      await updateTaskStatus(taskId, newStatus);
      console.log('[App] Task status changed');

      // Refresh tasks list
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
      setAlert({ type: 'success', message: `Task marked as ${newStatus}` });
    } catch (err) {
      console.error('[App] Error changing task status:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setAlert({ type: 'error', message: `Failed to update task status: ${errorMessage}` });
    }
  };

  // Handle calendar date selection
  const handleCalendarDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Update Notification */}
      {showUpdateNotification && newVersion && (
        <UpdateNotification
          version={newVersion.version}
          changelog={newVersion.changelog}
          onUpdate={applyUpdate}
          onDismiss={() => setShowUpdateNotification(false)}
          downloadUrl={newVersion.downloadUrl}
        />
      )}

      {/* Alert Notification */}
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl font-bold text-gray-900">TimeKeeper</h1>
                <span className="text-xs text-gray-400 font-medium">v1.0.11</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Manage your tasks efficiently</p>
            </div>
            <div className="flex items-center gap-4">
              <ConnectivityStatus isOnline={isOnline} isSyncing={isSyncing} />
              <button
                onClick={() => setIsFormOpen(true)}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + New Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tomorrow's Deadline Reminder */}
        {tomorrowTasks.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900">Deadline Reminder</h3>
                <p className="text-sm text-amber-800 mt-1">
                  You have <span className="font-bold">{tomorrowTasks.length}</span> {tomorrowTasks.length === 1 ? 'task' : 'tasks'} due tomorrow!
                </p>
                <div className="mt-2 text-xs text-amber-700">
                  {tomorrowTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        task.priority === 'High' ? 'bg-red-500' : 
                        task.priority === 'Medium' ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}></span>
                      {task.title}
                    </div>
                  ))}
                  {tomorrowTasks.length > 3 && <div className="text-amber-700">+ {tomorrowTasks.length - 3} more</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading schedule...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-red-900 font-bold text-lg mb-2">Firebase Error</h3>
            <p className="text-red-800 font-medium mb-4">{error}</p>
            <div className="bg-red-100 p-3 rounded mb-4 text-sm text-red-900 font-mono">
              Check browser console (F12) for detailed error logs
            </div>
            <div className="text-red-700 text-sm space-y-2">
              <p><strong>To fix this:</strong></p>
              <ul className="list-disc list-inside ml-2">
                <li>Did you create the Firestore database?</li>
                <li>Did you create the "tasks" collection in Firestore?</li>
                <li>Did you set Firestore security rules to allow reads?</li>
                <li>Check the browser console for the full error message</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && !error && (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <p className="text-gray-500 font-medium text-lg mb-2">No tasks yet</p>
              <p className="text-gray-400 text-sm mb-4">Click "New Task" to create your first task</p>
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar: Calendar */}
            <div className="lg:col-span-1">
              <Calendar
                tasks={tasks}
                selectedDate={selectedDate}
                onSelectDate={handleCalendarDateSelect}
              />
            </div>

            {/* Main: Filter, Sort & Tasks */}
            <div className="lg:col-span-3">
              {/* Date Selection Info */}
              {selectedDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex justify-between items-center">
                  <p className="text-blue-800 font-medium">
                    Showing tasks for {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Filter and Sort Controls */}
              <FilterSortControls
                sortBy={sortBy}
                filterStatus={filterStatus}
                itemsPerPage={itemsPerPage}
                onSortChange={setSortBy}
                onFilterChange={setFilterStatus}
                onItemsPerPageChange={setItemsPerPage}
              />

              {/* Tasks Grid */}
              {filteredTasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-500 font-medium">
                    {selectedDate 
                      ? `No tasks scheduled for ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : 'No tasks match your filters'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedTasks.map((task: Task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {itemsPerPage !== -1 && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Previous
                      </button>
                      <span className="text-gray-700 font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleAddTask}
        isLoading={isSubmitting}
        editingTask={editingTask}
      />
    </div>
  );
};

export default App;
