import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin1234");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await API.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Нэвтрэх нэр эсвэл нууц үг буруу байна");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">BT</div>

        <h1>Welcome back</h1>
        <p>Traceability систем рүү нэвтрэх</p>

        <form onSubmit={handleLogin} className="form">
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin1234"
              type="password"
            />
          </label>

          <button className="btn btn-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="hint">
          Demo хэрэглэгч: <b>admin</b> / <b>admin1234</b>
        </div>
      </div>
    </div>
  );
}