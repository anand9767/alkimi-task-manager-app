export type TaskStatus = "pending" | "completed";
export type FilterType = "all" | "pending" | "completed";
export type PriorityType = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
}

export interface ExtendedTask extends Task {
  priority?: PriorityType;
  dueDate?: string;
}

