import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  return (
    <>
      <Navbar />

      <main className="page">
        <section className="hero">
          <div>
            <span className="eyebrow">Blockchain based traceability</span>
            <h2>Махны гарал үүслийг QR / Product code-р шалгах систем</h2>
            <p>
              Бүтээгдэхүүний бүртгэл, нийлүүлэлтийн event, mock blockchain hash,
              JWT authentication, RBAC болон audit log-той demo систем.
            </p>
          </div>

          <div className="hero-card">
            <small>Logged in as</small>
            <strong>{username}</strong>
            <span>{role}</span>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>01</span>
            <h3>Product Registration</h3>
            <p>Admin/Farmer role бүтээгдэхүүн бүртгэнэ.</p>
          </div>

          <div className="stat-card">
            <span>02</span>
            <h3>Trace Events</h3>
            <p>Supply chain event бүр hash-тэй хадгалагдана.</p>
          </div>

          <div className="stat-card">
            <span>03</span>
            <h3>Verification</h3>
            <p>Consumer product code-р түүхийг шалгана.</p>
          </div>
        </section>

        <section className="actions-grid">
          <Link className="action-card" to="/products/create">
            <h3>Бүтээгдэхүүн бүртгэх</h3>
            <p>MEAT-001 гэх мэт бүтээгдэхүүний code үүсгэнэ.</p>
          </Link>

          <Link className="action-card" to="/events/create">
            <h3>Trace event нэмэх</h3>
            <p>Farm, slaughter, transport event бүртгэнэ.</p>
          </Link>

          <Link className="action-card" to="/verify">
            <h3>Бүтээгдэхүүн шалгах</h3>
            <p>Timeline болон transaction hash шалгана.</p>
          </Link>
        </section>
      </main>
    </>
  );
}