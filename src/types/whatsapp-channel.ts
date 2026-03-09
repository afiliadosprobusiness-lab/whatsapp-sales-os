export type WhatsAppChannelStatus =
  | "ACTIVE"
  | "PAUSED"
  | "PENDING"
  | "INACTIVE"
  | "DISCONNECTED"
  | "ERROR"
  | "UNKNOWN"
  | string;

export interface WhatsAppChannel {
  id: string;
  provider: string;
  status: WhatsAppChannelStatus;
  displayName?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface UpsertWhatsAppChannelRequest {
  provider?: string;
  status?: WhatsAppChannelStatus;
  displayName?: string;
  phoneNumber?: string;
  metadata?: Record<string, unknown>;
}

export interface WhatsAppChannelApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface WhatsAppChannelApiEnvelope<TData> {
  data: TData | null;
  error: WhatsAppChannelApiErrorPayload | null;
}
