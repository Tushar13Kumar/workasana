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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/tasks/${id}`);
        setTask(res.data);
        setEditStatus(res.data.status);
        setEditPriority(res.data.priority || "Low");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.patch(`/tasks/${id}`, { status: editStatus, priority: editPriority });
      setTask(res.data);
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/tasks/${id}`);
      navigate("/tasks");
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
        <p style={{ color: "#9ca3af" }}>Loading task...</p>
      </main>
    </div>
  );

  if (!task) return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        <p style={{ color: "#ef4444" }}>Task not found.</p>
        <button onClick={() => navigate("/tasks")} style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
          ← Back to Tasks
        </button>
      </main>
    </div>
  );

  const sc = statusColors[task.status] || { bg: "#f3f4f6", color: "#6b7280" };
  const owners = task.owners?.length ? task.owners : (task.owner ? [task.owner] : []);
  const colors = ["#ede9fe", "#dbeafe", "#dcfce7", "#fef9c3", "#fce7f3"];
  const textColors = ["#7c3aed", "#1d4ed8", "#15803d", "#a16207", "#be185d"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", color: "#7c3aed",
          fontSize: "13px", fontWeight: 500, cursor: "pointer",
          padding: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "4px"
        }}>← Back</button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>

          {/* Main Info */}
          <div>
            <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span style={{ backgroundColor: sc.bg, color: sc.color, fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px" }}>
                  {task.status}
                </span>
                <button onClick={() => setShowDeleteConfirm(true)} style={{
                  backgroundColor: "#fee2e2", color: "#dc2626",
                  border: "none", borderRadius: "8px",
                  padding: "6px 14px", fontSize: "12px",
                  fontWeight: 500, cursor: "pointer",
                }}>🗑 Delete</button>
              </div>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{task.name || task.title}</h1>

              {/* Meta info */}
              <div style={{ display: "flex", gap: "24px", marginTop: "20px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Project</p>
                  <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>{task.project?.name || "—"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Team</p>
                  <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>{task.team?.name || "—"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Due Date</p>
                  <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "No date"}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Priority</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, margin: 0, color: task.priority === "High" ? "#dc2626" : task.priority === "Medium" ? "#d97706" : "#6b7280" }}>
                    ⬤ {task.priority || "Low"}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Time to Complete</p>
                  <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>{task.timeToComplete} day{task.timeToComplete !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Tags */}
              {task.tags?.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Tags</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {task.tags.map((tag, i) => (
                      <span key={i} style={{ backgroundColor: "#ede9fe", color: "#7c3aed", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Owners */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>Assigned To</h3>
              {owners.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>Unassigned</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {owners.map((owner, i) => (
                    <div key={owner._id || i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        backgroundColor: colors[i % colors.length],
                        color: textColors[i % textColors.length],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", fontWeight: 600, flexShrink: 0,
                      }}>{owner.name?.[0]?.toUpperCase() || "?"}</div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 500, color: "#111827", margin: 0 }}>{owner.name || "Unknown"}</p>
                        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{owner.email || ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Edit Panel */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "24px", alignSelf: "start" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 20px" }}>Update Task</h3>

            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Status</label>
            <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", marginBottom: "16px", backgroundColor: "#fff" }}>
              {["To Do", "In Progress", "Completed", "Blocked"].map(s => <option key={s}>{s}</option>)}
            </select>

            <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Priority</label>
            <select value={editPriority} onChange={e => setEditPriority(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", marginBottom: "20px", backgroundColor: "#fff" }}>
              {["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}
            </select>

            <button onClick={handleSave} disabled={saving} style={{
              width: "100%", padding: "10px", backgroundColor: "#7c3aed", color: "#fff",
              border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 500,
              cursor: "pointer", opacity: saving ? 0.7 : 1,
            }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saveMsg && <p style={{ color: "#15803d", fontSize: "13px", textAlign: "center", marginTop: "8px" }}>{saveMsg}</p>}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
        }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "400px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 600, color: "#111827" }}>Delete Task?</h3>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 24px" }}>
              Are you sure you want to delete <strong>{task.name || task.title}</strong>? This action cannot be undone.
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

export default TaskDetail;