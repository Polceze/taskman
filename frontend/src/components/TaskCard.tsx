import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import type { Task } from "../types/task";
import { StatusBadge } from "./StatusBadge";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dueDateObj = task.due_date ? new Date(task.due_date) : null;
  const isOverdue =
    dueDateObj &&
    task.status !== "completed" &&
    isPast(dueDateObj) &&
    !isToday(dueDateObj);

  return (
    <div className="card p-4 animate-fade-up">
      {/* Top row: title + actions */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`flex-1 text-sm font-medium leading-snug ${
            task.status === "completed" ? "line-through text-subtle" : "text-ink"
          }`}
        >
          {task.title}
        </h3>

        <div className="flex shrink-0 items-center gap-1">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-subtle hover:bg-border hover:text-ink transition-colors"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M9.5 1.5l2 2L4 11H2v-2L9.5 1.5z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-subtle hover:bg-red-50 hover:text-red-500 transition-colors"
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete task"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v3.5M7.5 6v3.5M3 3.5l.5 7a.5.5 0 00.5.5h5a.5.5 0 00.5-.5l.5-7"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-1.5 text-xs leading-relaxed text-subtle line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} />

        {dueDateObj && (
          <span
            className={`text-xs font-mono ${
              isOverdue ? "text-red-500" : "text-subtle"
            }`}
          >
            {isOverdue && "⚠ "}Due {format(dueDateObj, "MMM d, yyyy")}
          </span>
        )}

        <span className="ml-auto text-xs font-mono text-subtle">
          #{task.id}
        </span>
      </div>

      {/* Inline delete confirm */}
      {confirmDelete && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
          <p className="text-xs text-red-700">Delete this task?</p>
          <div className="flex gap-2">
            <button
              className="text-xs text-subtle hover:text-ink"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
            <button
              className="text-xs font-medium text-red-600 hover:text-red-700"
              onClick={() => {
                setConfirmDelete(false);
                onDelete(task);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
