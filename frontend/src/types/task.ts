export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  create_date: string; // ISO 8601 string from API
  due_date: string | null;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  status: TaskStatus;
  due_date?: string | null;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string | null;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
}
