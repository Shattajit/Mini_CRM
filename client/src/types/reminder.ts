export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  clientId?: string;
  projectId?: string;
  client?: { name: string };
  project?: { title: string };
}

export interface ReminderFormData {
  title: string;
  description?: string;
  dueDate: string;
  clientId?: string;
  projectId?: string;
}
