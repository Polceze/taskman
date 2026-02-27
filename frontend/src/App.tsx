import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useTasks } from "./hooks/useTasks";
import { TaskCard } from "./components/TaskCard";
import { TaskForm } from "./components/TaskForm";
import { Modal } from "./components/Modal";
import type { Task, TaskStatus } from "./types/task";

const STATUS_FILTERS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function App() {
  const { tasks, total, loading, error, createTask, updateTask, deleteTask } =
    useTasks();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  // Filtered view
  const visibleTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  const counts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Toaster position="top-right" />

      {/* Header with create button */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-ink">
              Task Manager
            </h1>
            <p className="text-xs text-subtle">
              {total} total tasks
            </p>
          </div>
          <button
            className="px-3 py-1.5 bg-accent text-white rounded-md text-sm"
            onClick={() => setShowCreateModal(true)}
          >
            + New task
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="border-b border-border bg-surface/80">
        <div className="mx-auto max-w-3xl px-4 py-3 grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-lg font-semibold text-amber-600">{counts.pending}</p>
            <p className="text-xs text-subtle">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-blue-600">{counts.in_progress}</p>
            <p className="text-xs text-subtle">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-emerald-600">{counts.completed}</p>
            <p className="text-xs text-subtle">Completed</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 rounded-lg bg-surface border border-border p-1 w-fit">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                statusFilter === f.value
                  ? "bg-accent text-white"
                  : "text-subtle hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-20 text-subtle">
            Loading tasks...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">Error: {error}</p>
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-subtle">
              {statusFilter === "all"
                ? "No tasks yet. Create your first one!"
                : `No ${statusFilter.replace("_", " ")} tasks.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => deleteTask(t.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal title="New task" onClose={() => setShowCreateModal(false)}>
          <TaskForm
            onSubmit={async (payload) => {
              const ok = await createTask(payload);
              if (ok) setShowCreateModal(false);
              return ok;
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <Modal title="Edit task" onClose={() => setEditingTask(null)}>
          <TaskForm
            task={editingTask}
            onSubmit={async (payload) => {
              const ok = await updateTask(editingTask.id, payload);
              if (ok) setEditingTask(null);
              return ok;
            }}
            onCancel={() => setEditingTask(null)}
          />
        </Modal>
      )}
    </div>
  );
}