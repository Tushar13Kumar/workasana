import { useState, useEffect } from "react";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const statusColors = {
  "To Do": { bg: "#dbeafe", color: "#1d4ed8" },
  "In Progress": { bg: "#fef9c3", color: "#a16207" },
  "Completed": { bg: "#dcfce7", color: "#15803d" },
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/tasks");
      setTasks(res.data);
    };
    fetchData();
  }, []);

  const filtered = filter === "All" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: 0 }}>Tasks</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            {["All", "To Do", "In Progress", "Completed"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontSize: "12px", padding: "5px 14px", borderRadius: "999px",
                border: `1px solid ${filter === f ? "#7c3aed" : "#e5e7eb"}`,
                backgroundColor: filter === f ? "#7c3aed" : "#fff",
                color: filter === f ? "#fff" : "#6b7280",
                cursor: "pointer", fontWeight: 500,
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {["Task", "Owner", "Priority", "Due On", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "24px 16px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>No tasks found</td></tr>
              ) : filtered.map(task => {
                const sc = statusColors[task.status] || { bg: "#f3f4f6", color: "#6b7280" };
                return (
                  <tr key={task._id} style={{ borderBottom: "1px solid #f9fafb" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>{task.title || task.name}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600 }}>
                          {task.owner?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontSize: "13px", color: "#374151" }}>{task.owner?.name || "Unassigned"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: task.priority === "High" ? "#dc2626" : task.priority === "Medium" ? "#d97706" : "#6b7280" }}>
                        ⬤ {task.priority || "Low"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ backgroundColor: sc.bg, color: sc.color, fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px" }}>{task.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Tasks;