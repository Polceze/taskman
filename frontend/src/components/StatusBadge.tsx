import type { TaskStatus } from "../types/task";

interface Props {
  status: TaskStatus;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; dotColor: string; chipClass: string }
> = {
  pending: {
    label: "Pending",
    dotColor: "bg-amber-400",
    chipClass: "bg-amber-50 text-amber-700",
  },
  in_progress: {
    label: "In Progress",
    dotColor: "bg-blue-500",
    chipClass: "bg-blue-50 text-blue-700",
  },
  completed: {
    label: "Completed",
    dotColor: "bg-emerald-500",
    chipClass: "bg-emerald-50 text-emerald-700",
  },
};

export function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.chipClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
