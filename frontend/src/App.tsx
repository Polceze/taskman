import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskCard } from "./components/TaskCard";
import type { Task } from "./types/task";

export default function App() {
  const { tasks, loading, error } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Simple header - just title */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="text-xl font-semibold text-ink">Task Manager</h1>
        </div>
      </header>

      {/* Main content - just the task list */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-subtle">
            Loading tasks...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">
              Error: {error}
            </p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 text-subtle">
            No tasks yet.
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => console.log("Delete", t.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Placeholder for edit modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Edit modal</p>
            <button onClick={() => setEditingTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}