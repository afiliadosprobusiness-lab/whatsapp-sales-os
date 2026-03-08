export type LeadTaskStatus = "pending" | "done" | "cancelled";

export interface LeadTask {
  id: string;
  workspaceId?: string;
  leadId?: string;
  title: string;
  description?: string | null;
  status: LeadTaskStatus;
  dueAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeadTaskRequest {
  title: string;
  description?: string | null;
  dueAt?: string | null;
}

export interface UpdateLeadTaskRequest {
  title?: string;
  description?: string | null;
  dueAt?: string | null;
}

export interface UpdateLeadTaskStatusRequest {
  status: LeadTaskStatus;
}

export interface LeadTasksApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface LeadTasksApiEnvelope<TData> {
  data: TData | null;
  error: LeadTasksApiErrorPayload | null;
}
