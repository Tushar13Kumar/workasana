import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const statusColors = {
  "To Do": { bg: "#dbeafe", color: "#1d4ed8" },
  "In Progress": { bg: "#fef9c3", color: "#a16207" },
  "Completed": { bg: "#dcfce7", color: "#15803d" },
  "Blocked": { bg: "#fee2e2", color: "#dc2626" },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          API.get(`/projects/${id}`),
          API.get(`/tasks?project=${id}`),
        ]);
        setProject(projRes.data);
        setTasks(taskRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (e) {
      console.error(e);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9ca3af" }}>Loading...</p>
      </main>
    </div>
  );

  if (!project) return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        <p style={{ color: "#ef4444" }}>Project not found.</p>
        <button onClick={() => navigate("/projects")} style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
          ← Back to Projects
        </button>
      </main>
    </div>
  );

  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const inProgressCount = tasks.filter(t => t.status === "In Progress").length;
  const todoCount = tasks.filter(t => t.status === "To Do").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        {/* Back button */}
        <button onClick={() => navigate("/projects")} style={{
          background: "none", border: "none", color: "#7c3aed",
          fontSize: "13px", fontWeight: 500, cursor: "pointer",
          padding: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "4px"
        }}>← Back to Projects</button>

        {/* Project Header */}
        <div style={{
          backgroundColor: "#fff", border: "1px solid #f3f4f6",
          borderRadius: "16px", padding: "28px", marginBottom: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{
                backgroundColor: "#fef9c3", color: "#a16207",
                fontSize: "11px", fontWeight: 600,
                padding: "3px 10px", borderRadius: "999px",
                display: "inline-block", marginBottom: "12px",
              }}>In Progress</span>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{project.name}</h1>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{project.description || "No description provided."}</p>
              {project.createdAt && (
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: "8px 0 0" }}>
                  Created on {new Date(project.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
            <button onClick={() => setShowDeleteConfirm(true)} style={{
              backgroundColor: "#fee2e2", color: "#dc2626",
              border: "none", borderRadius: "8px",
              padding: "8px 16px", fontSize: "13px",
              fontWeight: 500, cursor: "pointer",
            }}>🗑 Delete Project</button>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            {[
              { label: "Total Tasks", value: tasks.length, bg: "#f9fafb", color: "#111827" },
              { label: "To Do", value: todoCount, bg: "#dbeafe", color: "#1d4ed8" },
              { label: "In Progress", value: inProgressCount, bg: "#fef9c3", color: "#a16207" },
              { label: "Completed", value: completedCount, bg: "#dcfce7", color: "#15803d" },
            ].map(stat => (
              <div key={stat.label} style={{
                backgroundColor: stat.bg, borderRadius: "10px",
                padding: "14px 20px", flex: 1, textAlign: "center",
              }}>
                <p style={{ fontSize: "22px", fontWeight: 700, color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Table */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827" }}>Tasks in this Project</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {["Task", "Team", "Status", "Due Date"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "24px 16px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>No tasks in this project yet</td></tr>
              ) : tasks.map(task => {
                const sc = statusColors[task.status] || { bg: "#f3f4f6", color: "#6b7280" };
                return (
                  <tr key={task._id}
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    style={{ borderBottom: "1px solid #f9fafb", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>{task.name || task.title}</td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{task.team?.name || "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ backgroundColor: sc.bg, color: sc.color, fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px" }}>{task.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
        }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "400px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 600, color: "#111827" }}>Delete Project?</h3>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 24px" }}>
              Are you sure you want to delete <strong>{project.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#fff", fontSize: "13px", cursor: "pointer", color: "#6b7280" }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ padding: "8px 18px", border: "none", borderRadius: "8px", backgroundColor: "#dc2626", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", opacity: deleting ? 0.7 : 1 }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;