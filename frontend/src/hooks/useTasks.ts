import { useState, useEffect, useCallback } from "react";
import { taskApi } from "../api/taskApi";
import type { Task, TaskCreatePayload, TaskUpdatePayload } from "../types/task";
import toast from "react-hot-toast";

export function useTasks(enabled: boolean = true) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.list();
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load tasks";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) fetchTasks();
    else {
      // Clear tasks when user logs out
      setTasks([]);
      setTotal(0);
      setError(null);
    }
  }, [enabled, fetchTasks]);

  const createTask = async (payload: TaskCreatePayload): Promise<boolean> => {
    try {
      const task = await taskApi.create(payload);
      setTasks((prev) => [task, ...prev]);
      setTotal((t) => t + 1);
      toast.success("Task created");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
      return false;
    }
  };

  const updateTask = async (id: number, payload: TaskUpdatePayload): Promise<boolean> => {
    try {
      const updated = await taskApi.update(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success("Task updated");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task");
      return false;
    }
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setTotal((t) => t - 1);
      toast.success("Task deleted");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
      return false;
    }
  };

  return {
    tasks,
    total,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}