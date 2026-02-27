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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            borderRadius: "10px",
            border: "1px solid #E5E5E3",
          },
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold tracking-tight text-ink">
              TaskMan
            </h1>
            <p className="text-xs text-subtle">
              {total} task{total !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v10M1 6h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            New task
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-3 grid grid-cols-3 gap-3">
          {[
            { label: "Pending", count: counts.pending, color: "text-amber-600" },
            { label: "In Progress", count: counts.in_progress, color: "text-blue-600" },
            { label: "Completed", count: counts.completed, color: "text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-xl font-semibold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-subtle">{s.label}</p>
            </div>
          ))}
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
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                statusFilter === f.value
                  ? "bg-accent text-white shadow-sm"
                  : "text-subtle hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-subtle">
            <span className="h-5 w-5 border-2 border-border border-t-accent rounded-full animate-spin mr-3" />
            Loading tasks…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">
              Could not load tasks
            </p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
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
            {visibleTasks.map((task, i) => (
              <div
                key={task.id}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <TaskCard
                  task={task}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={(t) => deleteTask(t.id)}
                  onStatusChange={(t, status) => updateTask(t.id, { status })}
                />
              </div>
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