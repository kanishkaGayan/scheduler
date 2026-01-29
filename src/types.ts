export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In-Progress' | 'Completed';
}
