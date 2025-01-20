export type FingerType = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export interface CaptureRequest {
  client_id: number;
  finger_type: FingerType;
  finger_image: string;
}

export interface ApiConfig {
  apiKey: string;
  bearerToken: string;
  baseUrl: string;
}

export interface ClientRequest {
  full_name: string;
  external_client_id: string;
  email: string;
}

export interface ClientResponse {
  status: string;
  technical_message: string | null;
  message: string;
  data: {
    client_id: number;
  };
}

export interface UploadResponse {
  status: string;
  technical_message: string | null;
  message: string;
  data: {
    client_id: number;
    finger_id: number;
  };
}

export interface FingerprintDetail {
  id: number;
  finger_type: FingerType;
  finger_image: string;
  fingerprint: string;
  created_at: string;
  client: number;
}

export interface FingerprintResponse {
  status: string;
  technical_message: string | null;
  message: string | null;
  data: FingerprintDetail[];
}