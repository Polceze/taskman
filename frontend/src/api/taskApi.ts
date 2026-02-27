import axios from "axios";
import type {
  Task,
  TaskCreatePayload,
  TaskUpdatePayload,
  TaskListResponse,
} from "../types/task";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Response interceptor with meaningful error messages
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.detail ?? err.message ?? "An unexpected error occurred";
    return Promise.reject(new Error(String(message)));
  }
);

export const taskApi = {
  /** Fetch all tasks */
  list: () =>
    client.get<TaskListResponse>("/api/tasks").then((r) => r.data),

  /** Fetch a single task */
  get: (id: number) =>
    client.get<Task>(`/api/tasks/${id}`).then((r) => r.data),

  /** Create a new task */
  create: (payload: TaskCreatePayload) =>
    client.post<Task>("/api/tasks", payload).then((r) => r.data),

  /** Update a task */
  update: (id: number, payload: TaskUpdatePayload) =>
    client.put<Task>(`/api/tasks/${id}`, payload).then((r) => r.data),

  /** Delete a task */
  delete: (id: number) =>
    client.delete(`/api/tasks/${id}`).then((r) => r.data),
};
