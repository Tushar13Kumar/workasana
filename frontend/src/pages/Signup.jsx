import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/login");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "36px", width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <p style={{ color: "#7c3aed", fontWeight: 700, fontSize: "18px", margin: "0 0 6px" }}>workasana</p>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>Create your account</h1>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>Please enter your details.</p>
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "13px", textAlign: "center", marginBottom: "16px" }}>{error}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Name</label>
            <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Password</label>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={handleSignup} style={{
            backgroundColor: "#7c3aed", color: "#fff", border: "none",
            borderRadius: "8px", padding: "10px", fontSize: "14px",
            fontWeight: 500, cursor: "pointer", marginTop: "4px",
          }}>Sign up</button>
        </div>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "20px" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#7c3aed", fontWeight: 500, textDecoration: "none" }}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;