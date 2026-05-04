import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";

type PublicTraceEvent = {
  event_type: string;
  description: string | null;
  location: string | null;
  temperature: number | null;
  event_time: string;
  verified_status: boolean;
};

type PublicProductResponse = {
  product: {
    product_code: string;
    name: string;
    animal_type: string;
    origin_location: string;
    qr_code: string;
  };
  verification: {
    status: "VERIFIED" | "NEEDS_REVIEW";
    verified_events: number;
    total_events: number;
  };
  traceability_history: PublicTraceEvent[];
};

const labels: Record<string, string> = {
  FARM_REGISTERED: "Гарал үүсэл бүртгэгдсэн",
  SLAUGHTERED: "Нядалгаанд орсон",
  PROCESSED: "Боловсруулсан",
  TRANSPORTED: "Тээвэрлэсэн",
  STORED: "Хадгалсан",
};

export default function PublicVerify() {
  const [searchParams] = useSearchParams();
  const productCode = searchParams.get("product");

  const [data, setData] = useState<PublicProductResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    if (!productCode) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get<PublicProductResponse>(
        `/public/products/${productCode}`
      );

      setData(res.data);
    } catch (error) {
      console.error(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productCode]);

  if (loading) {
    return (
      <main className="public-page">
        <div className="public-card">
          <h2>Мэдээлэл уншиж байна...</h2>
        </div>
      </main>
    );
  }

  if (!productCode || !data) {
    return (
      <main className="public-page">
        <div className="public-card">
          <h2>Бүтээгдэхүүн олдсонгүй</h2>
          <p>QR code буруу эсвэл бүтээгдэхүүн системд бүртгэгдээгүй байна.</p>
        </div>
      </main>
    );
  }

  const isVerified = data.verification.status === "VERIFIED";

  return (
    <main className="public-page">
      <section className="public-card public-hero-card">
        <span className={isVerified ? "public-status ok" : "public-status warn"}>
          {isVerified ? "Баталгаажсан бүтээгдэхүүн" : "Шалгах шаардлагатай"}
        </span>

        <h1>{data.product.name}</h1>
        <p>{data.product.origin_location}</p>

        <div className="public-info-grid">
          <div>
            <small>Product code</small>
            <strong>{data.product.product_code}</strong>
          </div>

          <div>
            <small>Махны төрөл</small>
            <strong>{data.product.animal_type}</strong>
          </div>

          <div>
            <small>Баталгаажсан үе шат</small>
            <strong>
              {data.verification.verified_events}/
              {data.verification.total_events}
            </strong>
          </div>
        </div>
      </section>

      <section className="public-card">
        <div className="section-title">
          <span className="eyebrow">Traceability history</span>
          <h2>Бүтээгдэхүүний түүх</h2>
          <p>
            Доорх мэдээлэл нь худалдан авагчид зориулсан баталгаажсан
            нийлүүлэлтийн мэдээлэл юм.
          </p>
        </div>

        <div className="public-timeline">
          {data.traceability_history.map((event, index) => (
            <div className="public-event" key={`${event.event_type}-${index}`}>
              <div className="public-event-index">{index + 1}</div>

              <div>
                <div className="public-event-header">
                  <h3>{labels[event.event_type] ?? event.event_type}</h3>
                  <span
                    className={
                      event.verified_status
                        ? "mini-status ok"
                        : "mini-status warn"
                    }
                  >
                    {event.verified_status ? "Verified" : "Review"}
                  </span>
                </div>

                <p>{event.description}</p>

                <div className="public-event-meta">
                  <span>📍 {event.location ?? "-"}</span>
                  <span>
                    🌡{" "}
                    {event.temperature !== null
                      ? `${event.temperature}°C`
                      : "-"}
                  </span>
                  <span>
                    🕒 {new Date(event.event_time).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}