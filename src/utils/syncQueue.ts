interface QueuedOperation {
  id: string;
  type: 'add' | 'update' | 'delete' | 'statusChange';
  data: any;
  timestamp: number;
}

const QUEUE_KEY = 'timekeeper_sync_queue';

class SyncQueue {
  private queue: QueuedOperation[] = [];

  constructor() {
    this.loadQueue();
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        console.log(`[SyncQueue] Loaded ${this.queue.length} queued operations`);
      }
    } catch (error) {
      console.error('[SyncQueue] Failed to load queue:', error);
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('[SyncQueue] Failed to save queue:', error);
    }
  }

  add(operation: Omit<QueuedOperation, 'timestamp'>) {
    const queuedOp: QueuedOperation = {
      ...operation,
      timestamp: Date.now(),
    };
    this.queue.push(queuedOp);
    this.saveQueue();
    console.log(`[SyncQueue] Added ${operation.type} operation for ${operation.id}`);
  }

  getAll(): QueuedOperation[] {
    return [...this.queue];
  }

  clear() {
    this.queue = [];
    localStorage.removeItem(QUEUE_KEY);
    console.log('[SyncQueue] Cleared all queued operations');
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

export const syncQueue = new SyncQueue();
