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

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/tasks/${id}`);
        setTask(res.data);
        if (res.data.status === "Completed") setMarked(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleMarkComplete = async () => {
    if (marked) return;
    setMarking(true);
    try {
      const res = await API.patch(`/tasks/${id}`, { status: "Completed" });
      setTask(res.data);
      setMarked(true);
    } catch (e) {
      console.error(e);
    } finally {
      setMarking(false);
    }
  };

  // Time remaining calculation
  const getTimeRemaining = () => {
    if (!task?.dueDate) return null;
    const today = new Date();
    const due = new Date(task.dueDate);
    const diffMs = due - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, overdue: true };
    if (diffDays === 0) return { text: "Due today", overdue: false };
    return { text: `${diffDays} days remaining`, overdue: false };
  };

  if (loading) return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9ca3af" }}>Loading task...</p>
      </main>
    </div>
  );

  if (!task) return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        <p style={{ color: "#ef4444" }}>Task not found.</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
          ← Go Back
        </button>
      </main>
    </div>
  );

  const sc = statusColors[task.status] || { bg: "#f3f4f6", color: "#6b7280" };
  const owners = task.owners?.length ? task.owners : (task.owner ? [task.owner] : []);
  const timeRemaining = getTimeRemaining();
  const colors = ["#ede9fe", "#dbeafe", "#dcfce7", "#fef9c3", "#fce7f3"];
  const textColors = ["#7c3aed", "#1d4ed8", "#15803d", "#a16207", "#be185d"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        {/* Back to Project */}
        <button onClick={() => task.project?._id ? navigate(`/projects/${task.project._id}`) : navigate(-1)} style={{
          background: "none", border: "none", color: "#7c3aed",
          fontSize: "13px", fontWeight: 500, cursor: "pointer",
          padding: 0, marginBottom: "20px",
        }}>← Back to Project</button>

        {/* Task Title */}
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 24px" }}>
          Task: {task.name || task.title}
        </h1>

        {/* Main Card */}
        <div style={{
          backgroundColor: "#fff", border: "1px solid #f3f4f6",
          borderRadius: "16px", padding: "28px", maxWidth: "680px",
        }}>

          {/* Details Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>

            {/* Project */}
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af", width: "100px", flexShrink: 0, paddingTop: "2px" }}>Project</span>
              <span style={{ fontSize: "14px", color: "#111827" }}>{task.project?.name || "—"}</span>
            </div>

            {/* Team */}
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af", width: "100px", flexShrink: 0, paddingTop: "2px" }}>Team</span>
              <span style={{ fontSize: "14px", color: "#111827" }}>{task.team?.name || "—"}</span>
            </div>

            {/* Owners */}
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af", width: "100px", flexShrink: 0, paddingTop: "6px" }}>Owners</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {owners.length === 0 ? (
                  <span style={{ fontSize: "14px", color: "#9ca3af" }}>Unassigned</span>
                ) : owners.map((owner, i) => (
                  <div key={owner._id || i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      backgroundColor: colors[i % colors.length],
                      color: textColors[i % textColors.length],
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 600, flexShrink: 0,
                    }}>{owner.name?.[0]?.toUpperCase() || "?"}</div>
                    <span style={{ fontSize: "14px", color: "#111827" }}>{owner.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af", width: "100px", flexShrink: 0, paddingTop: "4px" }}>Tags</span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {task.tags?.length > 0
                  ? task.tags.map(tag => (
                    <span key={tag} style={{
                      backgroundColor: "#ede9fe", color: "#7c3aed",
                      fontSize: "11px", fontWeight: 600,
                      padding: "3px 10px", borderRadius: "999px",
                    }}>{tag}</span>
                  ))
                  : <span style={{ fontSize: "14px", color: "#9ca3af" }}>No tags</span>
                }
              </div>
            </div>

            {/* Due Date */}
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af", width: "100px", flexShrink: 0, paddingTop: "2px" }}>Due Date</span>
              <span style={{ fontSize: "14px", color: "#111827" }}>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                  : "No date set"}
              </span>
            </div>

          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #f3f4f6", marginBottom: "24px" }} />

          {/* Status + Time Remaining + Mark as Complete */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Status */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af", width: "100px", flexShrink: 0 }}>Status</span>
              <span style={{
                backgroundColor: sc.bg, color: sc.color,
                fontSize: "12px", fontWeight: 600,
                padding: "4px 12px", borderRadius: "999px",
              }}>{task.status}</span>
            </div>

            {/* Time Remaining */}
            {timeRemaining && (
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af", width: "100px", flexShrink: 0 }}>Time Remaining</span>
                <span style={{
                  fontSize: "14px", fontWeight: 500,
                  color: timeRemaining.overdue ? "#dc2626" : "#111827",
                }}>{timeRemaining.text}</span>
              </div>
            )}

            {/* Mark as Complete Button */}
            <div style={{ marginTop: "8px" }}>
              <button
                onClick={handleMarkComplete}
                disabled={marked || marking}
                style={{
                  backgroundColor: marked ? "#dcfce7" : "#7c3aed",
                  color: marked ? "#15803d" : "#fff",
                  border: marked ? "1px solid #bbf7d0" : "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: marked ? "default" : "pointer",
                  opacity: marking ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {marked ? "✓ Marked as Complete" : marking ? "Saving..." : "Mark as Complete"}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetail;