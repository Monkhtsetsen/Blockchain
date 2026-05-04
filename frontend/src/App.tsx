import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductCreate from "./pages/ProductCreate";
import VerifyProduct from "./pages/VerifyProduct";
import TraceEventCreate from "./pages/TraceEventCreate";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import PublicVerify from "./pages/PublicVerify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/verify" />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/create"
          element={
            <ProtectedRoute>
              <ProductCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/create"
          element={
            <ProtectedRoute>
              <TraceEventCreate />
            </ProtectedRoute>
          }
        />

<Route path="/public/verify" element={<PublicVerify />} />
        <Route path="/verify" element={<VerifyProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;