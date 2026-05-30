import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const statusColors = {
  "To Do": { bg: "#dbeafe", color: "#1d4ed8" },
  "In Progress": { bg: "#fef9c3", color: "#a16207" },
  "Completed": { bg: "#dcfce7", color: "#15803d" },
  "Blocked": { bg: "#fee2e2", color: "#dc2626" },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  // Project modal state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projLoading, setProjLoading] = useState(false);
  const [projError, setProjError] = useState("");

  // Task modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskTeam, setTaskTeam] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [projRes, taskRes, teamRes] = await Promise.all([
        API.get("/projects"),
        API.get("/tasks"),
        API.get("/teams"),
      ]);
      setProjects(projRes.data);
      setTasks(taskRes.data);
      setTeams(teamRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async () => {
    if (!projName.trim()) return;
    setProjLoading(true);
    setProjError("");
    try {
      const res = await API.post("/projects", { name: projName, description: projDesc });
      setProjects([...projects, res.data]);
      setProjName("");
      setProjDesc("");
      setShowProjectModal(false);
    } catch (e) {
      setProjError(e.response?.data?.message || "Failed to create project");
    } finally {
      setProjLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !taskProject || !taskTeam) {
      setTaskError("Title, project and team are required");
      return;
    }
    setTaskLoading(true);
    setTaskError("");
    try {
      const res = await API.post("/tasks", {
        name: taskTitle,
        project: taskProject,
        team: taskTeam,
        status: taskStatus,
        dueDate: taskDueDate || undefined,
        priority: taskPriority,
        timeToComplete: 1,
      });
      setTasks([...tasks, res.data]);
      setTaskTitle("");
      setTaskProject("");
      setTaskTeam("");
      setTaskDueDate("");
      setTaskPriority("Medium");
      setTaskStatus("To Do");
      setShowTaskModal(false);
    } catch (e) {
      setTaskError(e.response?.data?.message || "Failed to create task");
    } finally {
      setTaskLoading(false);
    }
  };

  const filteredTasks = filter === "All"
    ? tasks
    : tasks.filter(t => t.status === filter);

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: "1px solid #e5e7eb", borderRadius: "8px",
    fontSize: "14px", outline: "none",
    marginBottom: "16px", boxSizing: "border-box",
    backgroundColor: "#fff",
  };

  const labelStyle = {
    fontSize: "13px", fontWeight: 500,
    color: "#374151", display: "block", marginBottom: "6px",
  };

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
            <button onClick={() => { setProjError(""); setShowProjectModal(true); }} style={{
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
              <div key={proj._id} onClick={() => navigate(`/projects/${proj._id}`)} style={{
                backgroundColor: "#fff", border: "1px solid #f3f4f6",
                borderRadius: "12px", padding: "20px", cursor: "pointer",
                transition: "box-shadow 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
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
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={() => { setTaskError(""); setShowTaskModal(true); }} style={{
                backgroundColor: "#7c3aed", color: "#fff",
                border: "none", borderRadius: "8px",
                padding: "8px 16px", fontSize: "13px",
                fontWeight: 500, cursor: "pointer",
              }}>+ Add Task</button>
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
              const ownerName = task.owners?.[0]?.name || task.owner?.name || "Unassigned";
              const ownerInitial = ownerName[0]?.toUpperCase() || "?";
              return (
                <div key={task._id} onClick={() => navigate(`/tasks/${task._id}`)} style={{
                  backgroundColor: "#fff", border: "1px solid #f3f4f6",
                  borderRadius: "12px", padding: "20px", cursor: "pointer",
                  transition: "box-shadow 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  <span style={{
                    backgroundColor: sc.bg, color: sc.color,
                    fontSize: "11px", fontWeight: 600,
                    padding: "3px 10px", borderRadius: "999px",
                  }}>{task.status}</span>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "12px 0 4px" }}>{task.name || task.title}</h3>
                  <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
                    Due on: {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      backgroundColor: "#ede9fe", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 600, color: "#7c3aed",
                    }}>{ownerInitial}</div>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>{ownerName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── Create Project Modal ── */}
      {showProjectModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "16px",
            padding: "28px", width: "100%", maxWidth: "440px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#111827" }}>Create New Project</h3>
              <button onClick={() => setShowProjectModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9ca3af" }}>×</button>
            </div>
            {projError && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{projError}</p>}
            <label style={labelStyle}>Project Name *</label>
            <input value={projName} onChange={e => setProjName(e.target.value)} placeholder="Enter project name" style={inputStyle} />
            <label style={labelStyle}>Project Description</label>
            <textarea value={projDesc} onChange={e => setProjDesc(e.target.value)} placeholder="Enter project description" rows={3}
              style={{ ...inputStyle, resize: "none" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowProjectModal(false)} style={{ padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#fff", fontSize: "13px", cursor: "pointer", color: "#6b7280" }}>Cancel</button>
              <button onClick={handleCreateProject} disabled={projLoading} style={{ padding: "8px 18px", border: "none", borderRadius: "8px", backgroundColor: "#7c3aed", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", opacity: projLoading ? 0.7 : 1 }}>
                {projLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Task Modal ── */}
      {showTaskModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "16px",
            padding: "28px", width: "100%", maxWidth: "480px",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#111827" }}>Add New Task</h3>
              <button onClick={() => setShowTaskModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9ca3af" }}>×</button>
            </div>
            {taskError && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{taskError}</p>}

            <label style={labelStyle}>Task Title *</label>
            <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Enter task title" style={inputStyle} />

            <label style={labelStyle}>Project *</label>
            <select value={taskProject} onChange={e => setTaskProject(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Select a project</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>

            <label style={labelStyle}>Team *</label>
            <select value={taskTeam} onChange={e => setTaskTeam(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Select a team</option>
              {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>

            <label style={labelStyle}>Due Date</label>
            <input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Priority</label>
            <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}>
              {["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}
            </select>

            <label style={labelStyle}>Status</label>
            <select value={taskStatus} onChange={e => setTaskStatus(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}>
              {["To Do", "In Progress", "Completed", "Blocked"].map(s => <option key={s}>{s}</option>)}
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
              <button onClick={() => setShowTaskModal(false)} style={{ padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#fff", fontSize: "13px", cursor: "pointer", color: "#6b7280" }}>Cancel</button>
              <button onClick={handleCreateTask} disabled={taskLoading} style={{ padding: "8px 18px", border: "none", borderRadius: "8px", backgroundColor: "#7c3aed", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", opacity: taskLoading ? 0.7 : 1 }}>
                {taskLoading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;