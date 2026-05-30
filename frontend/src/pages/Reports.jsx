import { useState, useEffect } from "react";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const statusColors = {
  "To Do": { bg: "#dbeafe", color: "#1d4ed8" },
  "In Progress": { bg: "#fef9c3", color: "#a16207" },
  "Completed": { bg: "#dcfce7", color: "#15803d" },
  "Blocked": { bg: "#fee2e2", color: "#dc2626" },
};

const Reports = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [pendingData, setPendingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, pendingRes] = await Promise.all([
          API.get("/tasks"),
          API.get("/report/pending"),
        ]);
        setAllTasks(tasksRes.data);
        setPendingData(pendingRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedTasks = allTasks.filter(t => t.status === "Completed");
  const inProgressTasks = allTasks.filter(t => t.status === "In Progress");
  const blockedTasks = allTasks.filter(t => t.status === "Blocked");
  const todoTasks = allTasks.filter(t => t.status === "To Do");

  const statCards = [
    { label: "Total Pending Days", value: pendingData?.totalPendingdays ?? (loading ? "..." : 0), color: "#fef9c3", text: "#a16207" },
    { label: "Completed Tasks", value: loading ? "..." : completedTasks.length, color: "#dcfce7", text: "#15803d" },
    { label: "In Progress", value: loading ? "..." : inProgressTasks.length, color: "#dbeafe", text: "#1d4ed8" },
    { label: "Blocked", value: loading ? "..." : blockedTasks.length, color: "#fee2e2", text: "#dc2626" },
    { label: "To Do", value: loading ? "..." : todoTasks.length, color: "#f3f4f6", text: "#6b7280" },
    { label: "Total Tasks", value: loading ? "..." : allTasks.length, color: "#ede9fe", text: "#7c3aed" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 24px" }}>Reports</h2>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {statCards.map((card, i) => (
            <div key={i} style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "12px", padding: "20px" }}>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 8px", fontWeight: 500 }}>{card.label}</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: "#111827", margin: 0 }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* All Tasks Overview Table */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827" }}>Task Overview</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {["Task Name", "Project", "Team", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>Loading...</td></tr>
              ) : allTasks.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>No tasks yet. Create some tasks first!</td></tr>
              ) : allTasks.map((task, i) => {
                const sc = statusColors[task.status] || { bg: "#f3f4f6", color: "#6b7280" };
                return (
                  <tr key={task._id || i} style={{ borderBottom: "1px solid #f9fafb" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "#111827", fontWeight: 500 }}>{task.name || task.title}</td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6b7280" }}>{task.project?.name || "—"}</td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6b7280" }}>{task.team?.name || "—"}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ backgroundColor: sc.bg, color: sc.color, fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px" }}>{task.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Last Week Completed Section */}
        <LastWeekSection />
      </main>
    </div>
  );
};

const LastWeekSection = () => {
  const [lastWeekTasks, setLastWeekTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/report/last-week")
      .then(res => setLastWeekTasks(res.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading || lastWeekTasks.length === 0) return null;

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "12px", overflow: "hidden", marginTop: "24px" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827" }}>Completed Last 7 Days</h3>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
            {["Task Name", "Project", "Team"].map(h => (
              <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lastWeekTasks.map((task, i) => (
            <tr key={task._id || i} style={{ borderBottom: "1px solid #f9fafb" }}>
              <td style={{ padding: "14px 20px", fontSize: "14px", color: "#111827" }}>{task.name || task.title}</td>
              <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6b7280" }}>{task.project?.name || "—"}</td>
              <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6b7280" }}>{task.team?.name || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;