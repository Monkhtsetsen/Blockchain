import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";

const eventTypes = [
  "FARM_REGISTERED",
  "SLAUGHTERED",
  "PROCESSED",
  "TRANSPORTED",
  "STORED",
];

export default function TraceEventCreate() {
  const [productCode, setProductCode] = useState("MEAT-001");
  const [eventType, setEventType] = useState("FARM_REGISTERED");
  const [description, setDescription] = useState("Малчны хотноос бүртгэгдсэн");
  const [location, setLocation] = useState("Архангай");
  const [temperature, setTemperature] = useState("5");
  const [eventTime, setEventTime] = useState("2026-05-04T10:00");
  const [result, setResult] = useState<any>(null);

  const createEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await API.post("/traceability/events", {
        product_code: productCode,
        event_type: eventType,
        description,
        location,
        temperature: Number(temperature),
        event_time: eventTime,
      });

      setResult(res.data);
    } catch (error: any) {
      console.error(error);
      setResult({
        error: error.response?.data?.detail ?? "Алдаа гарлаа",
      });
    }
  };

  return (
    <>
      <Navbar />

      <main className="page narrow-page">
        <div className="section-title">
          <span className="eyebrow">Traceability module</span>
          <h2>Trace event нэмэх</h2>
          <p>
            Event нэмэх бүрд data_hash, previous_hash, transaction_hash үүснэ.
          </p>
        </div>

        <form className="panel form" onSubmit={createEvent}>
          <label>
            Product code
            <input
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
            />
          </label>

          <label>
            Event type
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              {eventTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </label>

          <label>
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>

          <label>
            Temperature
            <input
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              type="number"
            />
          </label>

          <label>
            Event time
            <input
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              type="datetime-local"
            />
          </label>

          <button className="btn btn-full">Create trace event</button>

          {result && (
            <div className="result-box">
              {result.error ? (
                <p>{result.error}</p>
              ) : (
                <>
                  <p>Trace event амжилттай нэмэгдлээ.</p>
                  <small>Transaction hash</small>
                  <code>{result.transaction_hash}</code>
                  <small>Previous hash</small>
                  <code>{result.previous_hash ?? "Genesis block"}</code>
                </>
              )}
            </div>
          )}
        </form>
      </main>
    </>
  );
}