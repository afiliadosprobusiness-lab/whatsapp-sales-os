export type LeadMessageDirection = "inbound" | "outbound" | "unknown";

export interface LeadMessage {
  id: string;
  leadId?: string;
  channel: "WHATSAPP" | string;
  direction: LeadMessageDirection;
  text: string;
  createdAt?: string;
  status?: string;
  authorName?: string;
  providerMessageId?: string;
  rawType?: string;
  metadata?: Record<string, unknown>;
}

export interface SendLeadMessageRequest {
  text: string;
  channel?: "WHATSAPP" | string;
  metadata?: Record<string, unknown>;
}

export interface LeadMessagesApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface LeadMessagesApiEnvelope<TData> {
  data: TData | null;
  error: LeadMessagesApiErrorPayload | null;
}
