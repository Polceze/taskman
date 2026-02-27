import { useState, useEffect } from "react";
import type { Task, TaskCreatePayload, TaskStatus } from "../types/task";

interface Props {
  /** If provided, form operates in edit mode */
  task?: Task;
  onSubmit: (payload: TaskCreatePayload) => Promise<boolean>;
  onCancel: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function TaskForm({ task, onSubmit, onCancel }: Props) {
  const isEdit = Boolean(task);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "pending");
  // due_date stored as YYYY-MM-DD string for the date input
  const [dueDate, setDueDate] = useState(
    task?.due_date ? task.due_date.split("T")[0] : ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [titleError, setTitleError] = useState("");

  // Re-populate when the task prop changes (e.g. switching selected task)
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
      setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
    }
  }, [task]);

  const validate = (): boolean => {
    if (!title.trim()) {
      setTitleError("Title is required");
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload: TaskCreatePayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    };
    const ok = await onSubmit(payload);
    setSubmitting(false);
    if (ok && !isEdit) {
      // Reset form on successful create
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-ink mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          className={`input ${titleError ? "border-red-400 focus:ring-red-200" : ""}`}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setTitleError("");
          }}
          autoFocus
        />
        {titleError && (
          <p className="mt-1 text-xs text-red-500">{titleError}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-ink mb-1">
          Description
        </label>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Add more details (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Status + Due date in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Status
          </label>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Due Date
          </label>
          <input
            type="date"
            className="input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : (
            isEdit ? "Save changes" : "Create task"
          )}
        </button>
      </div>
    </form>
  );
}
