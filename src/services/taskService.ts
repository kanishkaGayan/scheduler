import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Task } from '../types';

// Data Converter: Handles conversion between Firestore Timestamps and JS Date objects
const taskConverter: FirestoreDataConverter<Task> = {
  // Convert Firestore document to Task object
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      // Convert Firestore Timestamp to JS Date
      deadline: data.deadline?.toDate ? data.deadline.toDate() : new Date(data.deadline),
      priority: data.priority,
      status: data.status,
    };
  },
  // Convert Task object to Firestore document
  toFirestore: (task) => {
    return {
      title: task.title,
      description: task.description,
      // Firestore will handle Date -> Timestamp conversion automatically
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
    };
  },
};

// Get all tasks from Firestore
export const getTasks = async (): Promise<Task[]> => {
  try {
    const tasksCollection = collection(db, 'tasks').withConverter(taskConverter);
    const querySnapshot = await getDocs(tasksCollection);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push(doc.data());
    });
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Add a new task to Firestore
export const addTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  try {
    console.log('[Task] Adding task to Firestore:', task);
    const tasksCollection = collection(db, 'tasks').withConverter(taskConverter);
    const docRef = await addDoc(tasksCollection, task);
    console.log('[Task] Task added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Task] Error adding task:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error code:', (error as any).code);
    }
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (id: string, status: string): Promise<void> => {
  try {
    const taskDoc = doc(db, 'tasks', id);
    await updateDoc(taskDoc, { status });
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

// Update entire task
export const updateTask = async (id: string, task: Partial<Omit<Task, 'id'>>): Promise<void> => {
  try {
    console.log('[Task] Updating task:', id, task);
    const taskDoc = doc(db, 'tasks', id);
    await updateDoc(taskDoc, task);
    console.log('[Task] Task updated successfully');
  } catch (error) {
    console.error('[Task] Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
