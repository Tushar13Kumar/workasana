import { useState, useEffect } from "react";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const statusColors = {
  "To Do": { bg: "#dbeafe", color: "#1d4ed8" },
  "In Progress": { bg: "#fef9c3", color: "#a16207" },
  "Completed": { bg: "#dcfce7", color: "#15803d" },
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await API.get("/projects");
        setProjects(projRes.data);
        const taskRes = await API.get("/tasks");
        setTasks(taskRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredTasks = filter === "All"
    ? tasks
    : tasks.filter(t => t.status === filter);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />

      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        {/* Search */}
        <input type="text" placeholder="Search"
          style={{
            width: "100%", maxWidth: "480px", padding: "9px 16px",
            border: "1px solid #e5e7eb", borderRadius: "8px",
            fontSize: "14px", outline: "none", backgroundColor: "#fff",
            marginBottom: "32px", display: "block",
          }}
        />

        {/* Projects */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", margin: 0 }}>Projects</h2>
            <button style={{
              backgroundColor: "#7c3aed", color: "#fff",
              border: "none", borderRadius: "8px",
              padding: "8px 16px", fontSize: "13px",
              fontWeight: 500, cursor: "pointer",
            }}>+ New Project</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {projects.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No projects yet</p>
            ) : projects.map((proj) => (
              <div key={proj._id} style={{
                backgroundColor: "#fff", border: "1px solid #f3f4f6",
                borderRadius: "12px", padding: "20px", cursor: "pointer",
              }}>
                <span style={{
                  backgroundColor: "#fef9c3", color: "#a16207",
                  fontSize: "11px", fontWeight: 600,
                  padding: "3px 10px", borderRadius: "999px",
                }}>In Progress</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "12px 0 4px" }}>{proj.name}</h3>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{proj.description || "No description"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", margin: 0 }}>My Tasks</h2>
            <div style={{ display: "flex", gap: "8px" }}>
              {["All", "In Progress", "Completed"].map((f) => (
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {filteredTasks.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No tasks found</p>
            ) : filteredTasks.map((task) => {
              const sc = statusColors[task.status] || { bg: "#f3f4f6", color: "#6b7280" };
              return (
                <div key={task._id} style={{
                  backgroundColor: "#fff", border: "1px solid #f3f4f6",
                  borderRadius: "12px", padding: "20px",
                }}>
                  <span style={{
                    backgroundColor: sc.bg, color: sc.color,
                    fontSize: "11px", fontWeight: 600,
                    padding: "3px 10px", borderRadius: "999px",
                  }}>{task.status}</span>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "12px 0 4px" }}>{task.title}</h3>
                  <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
                    Due on: {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      backgroundColor: "#ede9fe", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 600, color: "#7c3aed",
                    }}>{task.owner?.name?.[0]?.toUpperCase() || "?"}</div>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>{task.owner?.name || "Unassigned"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;