import type { TraceEvent } from "../types";

type Props = {
  events: TraceEvent[];
};

const eventLabels: Record<string, string> = {
  FARM_REGISTERED: "Farm Registered",
  SLAUGHTERED: "Slaughtered",
  PROCESSED: "Processed",
  TRANSPORTED: "Transported",
  STORED: "Stored",
};

export default function TraceTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="empty-box">
        Энэ бүтээгдэхүүн дээр trace event бүртгэгдээгүй байна.
      </div>
    );
  }

  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div className="timeline-item" key={event.event_id}>
          <div className="timeline-marker">
            <span>{index + 1}</span>
          </div>

          <div className="timeline-card">
            <div className="timeline-header">
              <div>
                <h3>{eventLabels[event.event_type] ?? event.event_type}</h3>
                <p>{event.description}</p>
              </div>

              <span
                className={
                  event.verified_status ? "status verified" : "status danger"
                }
              >
                {event.verified_status ? "Verified" : "Tampered"}
              </span>
            </div>

            <div className="info-grid">
              <div>
                <small>Location</small>
                <strong>{event.location ?? "-"}</strong>
              </div>

              <div>
                <small>Temperature</small>
                <strong>
                  {event.temperature !== null ? `${event.temperature}°C` : "-"}
                </strong>
              </div>

              <div>
                <small>Event time</small>
                <strong>{new Date(event.event_time).toLocaleString()}</strong>
              </div>
            </div>

            <div className="hash-box">
              <small>Transaction hash</small>
              <code>{event.transaction_hash}</code>
            </div>

            <div className="hash-box">
              <small>Previous hash</small>
              <code>{event.previous_hash ?? "Genesis block"}</code>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}