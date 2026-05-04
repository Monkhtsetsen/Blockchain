import { useState } from "react";
import API from "../api/api";
import type { ProductTraceResponse } from "../types";

export default function VerifyProduct() {
  const [productCode, setProductCode] = useState<string>("");
  const [data, setData] = useState<ProductTraceResponse | null>(null);

  const handleSearch = async () => {
    try {
      const res = await API.get<ProductTraceResponse>(
        `/traceability/${productCode}`
      );

      setData(res.data);
    } catch (error) {
      alert("Бүтээгдэхүүн олдсонгүй");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Бүтээгдэхүүний гарал үүсэл шалгах</h2>

      <input
        placeholder="Product code эсвэл QR code"
        value={productCode}
        onChange={(e) => setProductCode(e.target.value)}
      />

      <button onClick={handleSearch}>Шалгах</button>

      {data && (
        <div>
          <h3>{data.product.name}</h3>
          <p>Code: {data.product.product_code}</p>
          <p>Origin: {data.product.origin_location}</p>

          <h3>Traceability Timeline</h3>

          {data.trace_events.map((event) => (
            <div
              key={event.event_id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "8px",
              }}
            >
              <h4>{event.event_type}</h4>
              <p>{event.description}</p>
              <p>Location: {event.location}</p>
              <p>Temperature: {event.temperature}</p>
              <p>Time: {event.event_time}</p>
              <p>
                Verified:{" "}
                {event.verified_status ? "✅ Баталгаажсан" : "❌ Өөрчлөгдсөн"}
              </p>
              <small>Transaction Hash: {event.transaction_hash}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}