export type LeadActivityType = "NOTE" | "MESSAGE" | "STATUS_CHANGE" | "MANUAL" | "SYSTEM";

export interface LeadActivity {
  id: string;
  leadId?: string;
  type: LeadActivityType | string;
  text: string;
  createdAt?: string;
  createdByName?: string;
}

export interface CreateLeadActivityRequest {
  note: string;
  type?: LeadActivityType | string;
}

export interface LeadActivityApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface LeadActivityApiEnvelope<TData> {
  data: TData | null;
  error: LeadActivityApiErrorPayload | null;
}
