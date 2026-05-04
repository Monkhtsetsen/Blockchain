import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/api";
import type { ProductTraceResponse } from "../types";
import TraceTimeline from "../components/TraceTimeline";
import QRCodeBox from "../components/QRCodeBox";

export default function VerifyProduct() {
  const [searchParams] = useSearchParams();

  const productFromQR = searchParams.get("product");

  const [productCode, setProductCode] = useState(productFromQR || "MEAT-001");
  const [data, setData] = useState<ProductTraceResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (code?: string) => {
    const finalCode = code || productCode;

    if (!finalCode.trim()) {
      alert("Product code оруулна уу");
      return;
    }

    try {
      setLoading(true);

      const res = await API.get<ProductTraceResponse>(
        `/traceability/${finalCode.trim()}`
      );

      setData(res.data);
      setProductCode(finalCode.trim());
    } catch (error) {
      console.error(error);
      setData(null);
      alert("Бүтээгдэхүүн олдсонгүй");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productFromQR) {
      handleSearch(productFromQR);
    }
  }, [productFromQR]);

  const verifiedCount =
    data?.trace_events.filter((event) => event.verified_status).length ?? 0;

  const publicVerifyUrl = data
    ? `${window.location.origin}/public/verify?product=${data.product.product_code}`
    : "";

  return (
    <>
      <Navbar />

      <main className="page">
        <section className="verify-hero">
          <div>
            <span className="eyebrow">Consumer verification</span>
            <h2>Бүтээгдэхүүний гарал үүсэл шалгах</h2>
            <p>
              QR code уншуулах эсвэл product code оруулахад бүтээгдэхүүний
              мэдээлэл болон traceability history автоматаар харагдана.
            </p>
          </div>

          <div className="search-card">
            <input
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="MEAT-001"
            />
            <button
              className="btn"
              onClick={() => handleSearch()}
              disabled={loading}
            >
              {loading ? "Checking..." : "Verify"}
            </button>
          </div>
        </section>

        {data && (
          <>
            <section className="product-summary">
              <div className="summary-main">
                <span className="eyebrow">Product</span>
                <h2>{data.product.name}</h2>
                <p>{data.product.origin_location}</p>

                <QRCodeBox
                  value={publicVerifyUrl}
                  label="Scan to open product verification"
                  fileName={`${data.product.product_code}-qr`}
                  displayText={data.product.product_code}
                />
              </div>

              <div className="summary-grid">
                <div>
                  <small>Product code</small>
                  <strong>{data.product.product_code}</strong>
                </div>

                <div>
                  <small>Animal type</small>
                  <strong>{data.product.animal_type}</strong>
                </div>

                <div>
                  <small>QR code</small>
                  <strong>{data.product.qr_code}</strong>
                </div>

                <div>
                  <small>Verified events</small>
                  <strong>
                    {verifiedCount}/{data.trace_events.length}
                  </strong>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="section-title">
                <span className="eyebrow">Blockchain timeline</span>
                <h2>Traceability history</h2>
              </div>

              <TraceTimeline events={data.trace_events} />
            </section>
          </>
        )}
      </main>
    </>
  );
}