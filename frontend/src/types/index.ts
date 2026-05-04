export type UserRole =
  | "admin"
  | "farmer"
  | "processor"
  | "transporter"
  | "consumer";

export type TraceEvent = {
  event_id: number;
  event_type: string;
  description: string;
  location: string;
  temperature: number | null;
  event_time: string;
  transaction_hash: string | null;
  previous_hash: string | null;
  verified_status: boolean;
};

export type ProductTraceResponse = {
  product: {
    product_code: string;
    name: string;
    animal_type: string;
    origin_location: string;
    qr_code: string;
  };
  trace_events: TraceEvent[];
};