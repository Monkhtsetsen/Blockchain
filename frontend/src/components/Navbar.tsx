import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-badge">BT</div>
        <div>
          <h1>BeefChain Trace</h1>
          <p>Meat supply chain verification</p>
        </div>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products/create">Product</Link>
        <Link to="/events/create">Trace Event</Link>
        <Link to="/verify">Verify</Link>
      </div>

      <div className="nav-user">
        {token ? (
          <>
            <div className="user-pill">
              <span>{username}</span>
              <small>{role}</small>
            </div>
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link className="btn" to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}