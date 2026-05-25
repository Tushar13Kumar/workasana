import { useState, useEffect } from "react";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const Reports = () => {
  const [pending, setPending] = useState(null);
  const [complete, setComplete] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendingRes = await API.get("/report/pending");
        const completeRes = await API.get("/report/completed");
        setPending(pendingRes.data);
        setComplete(completeRes.data);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Total Pending Days", value: pending?.totalPendingdays ?? "—", color: "#fef9c3", text: "#a16207" },
    { label: "Completed Tasks", value: complete.length, color: "#dcfce7", text: "#15803d" },
    { label: "In Progress", value: complete.filter(t => t.status === "In Progress").length, color: "#dbeafe", text: "#1d4ed8" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 24px" }}>Reports</h2>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {statCards.map((card, i) => (
            <div key={i} style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "12px", padding: "20px" }}>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 8px", fontWeight: 500 }}>{card.label}</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: "#111827", margin: 0 }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Completed Tasks Table */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827" }}>Task Overview</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {["Task Name", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complete.length === 0 ? (
                <tr><td colSpan={2} style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>No data yet</td></tr>
              ) : complete.map((task, i) => (
                <tr key={task._id || i} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <td style={{ padding: "14px 20px", fontSize: "14px", color: "#111827" }}>{task.name || task.title}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px" }}>{task.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Reports;