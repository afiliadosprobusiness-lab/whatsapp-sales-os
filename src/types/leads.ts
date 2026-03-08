export type LeadStatus = "NEW" | "CONTACTED" | "INTERESTED" | "FOLLOW_UP" | "CLOSED" | "LOST";

export type LeadPriority = "HIGH" | "MEDIUM" | "LOW";

export type LeadsViewState = "idle" | "loading" | "success" | "error" | "empty";

export interface LeadOwner {
  id?: string;
  fullName?: string;
  email?: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  priority: LeadPriority;
  score: number;
  closeProbability: number;
  estimatedValueCents?: number;
  source?: string;
  owner?: LeadOwner;
  lastContactAt?: string;
  notes?: string;
}

export interface LeadTimelineEvent {
  id: string;
  text: string;
  timestamp?: string;
  type?: string;
}

export interface LeadDetail extends Lead {
  timeline: LeadTimelineEvent[];
}

export interface GetLeadsParams {
  status?: LeadStatus;
  priority?: LeadPriority;
  owner?: string;
  query?: string;
  source?: string;
}

export interface CreateLeadRequest {
  name: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  estimatedValueCents?: number;
  source?: string;
  notes?: string;
}

export interface UpdateLeadRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  estimatedValueCents?: number;
  source?: string;
  notes?: string;
}

export interface UpdateLeadStatusRequest {
  status: LeadStatus;
}

export interface LeadsApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface LeadsApiEnvelope<TData> {
  data: TData | null;
  error: LeadsApiErrorPayload | null;
}
