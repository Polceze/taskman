import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import type { Task, TaskStatus } from "../types/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => Promise<boolean>;
}

// Config for the three status toggle pills
const STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
  activeClass: string;
  hoverClass: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
    activeClass: "bg-amber-100 text-amber-700 border-amber-300",
    hoverClass: "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200",
  },
  {
    value: "in_progress",
    label: "In Progress",
    activeClass: "bg-blue-100 text-blue-700 border-blue-300",
    hoverClass: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
  },
  {
    value: "completed",
    label: "Completed",
    activeClass: "bg-emerald-100 text-emerald-700 border-emerald-300",
    hoverClass: "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200",
  },
];

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const dueDateObj = task.due_date ? new Date(task.due_date) : null;
  const isOverdue =
    dueDateObj &&
    task.status !== "completed" &&
    isPast(dueDateObj) &&
    !isToday(dueDateObj);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    // No-op if already the current status
    if (newStatus === task.status) return;
    setChangingStatus(true);
    await onStatusChange(task, newStatus);
    setChangingStatus(false);
  };

  return (
    <div className="card p-4 animate-fade-up">
      {/* Top row: title + edit/delete actions */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`flex-1 text-sm font-medium leading-snug transition-all duration-200 ${
            task.status === "completed"
              ? "line-through text-subtle"
              : "text-ink"
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

      {/* Status toggle — segmented pill group */}
      <div className="mt-3 flex items-center gap-1">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = task.status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              disabled={changingStatus}
              aria-pressed={isActive}
              aria-label={`Set status to ${opt.label}`}
              className={`
                relative flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium
                transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60
                ${isActive
                  ? opt.activeClass
                  : `border-border bg-transparent text-subtle ${opt.hoverClass}`
                }
              `}
            >
              {/* Spinner on the active pill while saving */}
              {changingStatus && isActive && (
                <span className="h-2.5 w-2.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              )}
              {opt.label}
            </button>
          );
        })}

        {/* Due date pushed to the right */}
        {dueDateObj && (
          <span
            className={`ml-auto text-xs font-mono ${
              isOverdue ? "text-red-500" : "text-subtle"
            }`}
          >
            {isOverdue && "⚠ "}Due {format(dueDateObj, "MMM d, yyyy")}
          </span>
        )}
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