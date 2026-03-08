export type TaskStatus = "pending" | "done" | "cancelled";

export type TasksInboxFilter = "pending" | "today" | "overdue" | "done";

export interface TaskLeadReference {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Task {
  id: string;
  workspaceId?: string;
  leadId?: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  lead?: TaskLeadReference;
}

export interface TaskStatusUpdateRequest {
  status: TaskStatus;
}

export interface TasksSummary {
  pending: number;
  today: number;
  overdue: number;
  done: number;
  total?: number;
}

export interface TasksApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface TasksApiEnvelope<TData> {
  data: TData | null;
  error: TasksApiErrorPayload | null;
}
