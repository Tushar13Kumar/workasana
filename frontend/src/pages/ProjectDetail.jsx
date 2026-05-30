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
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sort
  const [filterOwner, setFilterOwner] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [sortBy, setSortBy] = useState("none"); // "dueDate" | "priority"

  // Add Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskTeam, setTaskTeam] = useState("");
  const [taskOwners, setTaskOwners] = useState([]);
  const [taskTags, setTaskTags] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskDays, setTaskDays] = useState("1");
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes, teamRes] = await Promise.all([
          API.get(`/projects/${id}`),
          API.get(`/tasks?project=${id}`),
          API.get("/teams"),
        ]);
        setProject(projRes.data);
        setTasks(taskRes.data);
        setTeams(teamRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Derive unique owners and tags from tasks for filter dropdowns
  const allOwners = [];
  const seenOwners = new Set();
  tasks.forEach(t => {
    const owners = t.owners?.length ? t.owners : (t.owner ? [t.owner] : []);
    owners.forEach(o => {
      if (o?._id && !seenOwners.has(o._id)) {
        seenOwners.add(o._id);
        allOwners.push(o);
      }
    });
  });

  const allTags = [...new Set(tasks.flatMap(t => t.tags || []))];

  // Apply filters
  let filteredTasks = [...tasks];

  if (filterOwner !== "All") {
    filteredTasks = filteredTasks.filter(t => {
      const owners = t.owners?.length ? t.owners : (t.owner ? [t.owner] : []);
      return owners.some(o => o?._id === filterOwner);
    });
  }

  if (filterTag !== "All") {
    filteredTasks = filteredTasks.filter(t => t.tags?.includes(filterTag));
  }

  // Apply sort
  const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
  if (sortBy === "dueDate") {
    filteredTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  } else if (sortBy === "priority") {
    filteredTasks.sort((a, b) => {
      return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    });
  }

  const handleCreateTask = async () => {
    if (!taskName.trim() || !taskTeam) {
      setTaskError("Task name and team are required");
      return;
    }
    setTaskLoading(true);
    setTaskError("");
    try {
      const tagsArray = taskTags.split(",").map(t => t.trim()).filter(Boolean);
      const res = await API.post("/tasks", {
        name: taskName,
        project: id,
        team: taskTeam,
        owners: taskOwners,
        tags: tagsArray,
        dueDate: taskDueDate || undefined,
        timeToComplete: Number(taskDays) || 1,
        status: "To Do",
      });
      setTasks(prev => [...prev, res.data]);
      setTaskName(""); setTaskTeam(""); setTaskOwners([]);
      setTaskTags(""); setTaskDueDate(""); setTaskDays("1");
      setShowTaskModal(false);
    } catch (e) {
      setTaskError(e.response?.data?.message || "Failed to create task");
    } finally {
      setTaskLoading(false);
    }
  };

  const toggleOwner = (userId) => {
    setTaskOwners(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: "1px solid #e5e7eb", borderRadius: "8px",
    fontSize: "14px", outline: "none",
    marginBottom: "14px", boxSizing: "border-box",
    backgroundColor: "#fff",
  };

  const labelStyle = {
    fontSize: "13px", fontWeight: 500,
    color: "#374151", display: "block", marginBottom: "5px",
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

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        {/* Back */}
        <button onClick={() => navigate("/projects")} style={{
          background: "none", border: "none", color: "#7c3aed",
          fontSize: "13px", fontWeight: 500, cursor: "pointer",
          padding: 0, marginBottom: "20px",
        }}>← Back to Dashboard</button>

        {/* Project Title */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
            Project: {project.name}
          </h1>
          {project.description && (
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{project.description}</p>
          )}
        </div>

        {/* Toolbar — filters + sort + add task */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          flexWrap: "wrap", marginBottom: "20px",
        }}>
          {/* Filter by Owner */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>By Owner:</span>
            <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} style={{
              padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: "8px",
              fontSize: "13px", outline: "none", backgroundColor: "#fff", cursor: "pointer",
            }}>
              <option value="All">All</option>
              {allOwners.map(o => (
                <option key={o._id} value={o._id}>{o.name}</option>
              ))}
            </select>
          </div>

          {/* Filter by Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>By Tag:</span>
            <select value={filterTag} onChange={e => setFilterTag(e.target.value)} style={{
              padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: "8px",
              fontSize: "13px", outline: "none", backgroundColor: "#fff", cursor: "pointer",
            }}>
              <option value="All">All</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>Sort by:</span>
            <button onClick={() => setSortBy(sortBy === "dueDate" ? "none" : "dueDate")} style={{
              padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
              border: `1px solid ${sortBy === "dueDate" ? "#7c3aed" : "#e5e7eb"}`,
              backgroundColor: sortBy === "dueDate" ? "#ede9fe" : "#fff",
              color: sortBy === "dueDate" ? "#7c3aed" : "#6b7280",
              cursor: "pointer",
            }}>Due Date</button>
            <button onClick={() => setSortBy(sortBy === "priority" ? "none" : "priority")} style={{
              padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
              border: `1px solid ${sortBy === "priority" ? "#7c3aed" : "#e5e7eb"}`,
              backgroundColor: sortBy === "priority" ? "#ede9fe" : "#fff",
              color: sortBy === "priority" ? "#7c3aed" : "#6b7280",
              cursor: "pointer",
            }}>Priority</button>
          </div>

          {/* Add Task — pushed to right */}
          <button onClick={() => { setTaskError(""); setShowTaskModal(true); }} style={{
            marginLeft: "auto",
            backgroundColor: "#7c3aed", color: "#fff", border: "none",
            borderRadius: "8px", padding: "8px 16px", fontSize: "13px",
            fontWeight: 500, cursor: "pointer",
          }}>+ Add New Task</button>
        </div>

        {/* Task List */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {["Task", "Status", "Owner", "Due Date", "Tags"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: "12px", fontWeight: 600, color: "#6b7280",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                    {tasks.length === 0 ? "No tasks yet — add one!" : "No tasks match the selected filters"}
                  </td>
                </tr>
              ) : filteredTasks.map(task => {
                const sc = statusColors[task.status] || { bg: "#f3f4f6", color: "#6b7280" };
                const owners = task.owners?.length ? task.owners : (task.owner ? [task.owner] : []);
                const ownerNames = owners.map(o => o?.name || "?").join(", ") || "Unassigned";
                return (
                  <tr key={task._id}
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    style={{ borderBottom: "1px solid #f9fafb", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>
                      {task.name || task.title}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        backgroundColor: sc.bg, color: sc.color,
                        fontSize: "11px", fontWeight: 600,
                        padding: "3px 10px", borderRadius: "999px",
                      }}>{task.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <div style={{
                          width: "26px", height: "26px", borderRadius: "50%",
                          backgroundColor: "#ede9fe", color: "#7c3aed",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: 600, flexShrink: 0,
                        }}>{ownerNames[0]?.toUpperCase() || "?"}</div>
                        <span style={{ fontSize: "13px", color: "#374151" }}>{ownerNames}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : "No date"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {task.tags?.length > 0
                          ? task.tags.map(tag => (
                            <span key={tag} style={{
                              backgroundColor: "#ede9fe", color: "#7c3aed",
                              fontSize: "10px", fontWeight: 600,
                              padding: "2px 8px", borderRadius: "999px",
                            }}>{tag}</span>
                          ))
                          : <span style={{ color: "#d1d5db", fontSize: "13px" }}>—</span>
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Add Task Modal ── */}
      {showTaskModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "16px",
            padding: "28px", width: "100%", maxWidth: "480px",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#111827" }}>
                Create New Task for {project.name}
              </h3>
              <button onClick={() => setShowTaskModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9ca3af" }}>×</button>
            </div>

            {taskError && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{taskError}</p>}

            <label style={labelStyle}>Task Name *</label>
            <input value={taskName} onChange={e => setTaskName(e.target.value)}
              placeholder="Enter task name" style={inputStyle} />

            <label style={labelStyle}>Team *</label>
            <select value={taskTeam} onChange={e => setTaskTeam(e.target.value)} style={inputStyle}>
              <option value="">Select a team</option>
              {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>

            <label style={labelStyle}>Owners</label>
            <div style={{
              border: "1px solid #e5e7eb", borderRadius: "8px",
              padding: "10px 12px", marginBottom: "14px",
              maxHeight: "120px", overflowY: "auto",
            }}>
              {users.length === 0 ? (
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                  No users available — owners can be assigned later
                </p>
              ) : users.map(u => (
                <label key={u._id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0", cursor: "pointer", fontSize: "13px", color: "#374151" }}>
                  <input type="checkbox" checked={taskOwners.includes(u._id)} onChange={() => toggleOwner(u._id)} />
                  {u.name}
                </label>
              ))}
            </div>

            <label style={labelStyle}>Tags <span style={{ color: "#9ca3af", fontWeight: 400 }}>(comma separated)</span></label>
            <input value={taskTags} onChange={e => setTaskTags(e.target.value)}
              placeholder="e.g. Urgent, Bug, Frontend" style={inputStyle} />

            <label style={labelStyle}>Due Date</label>
            <input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Time to Complete (Days)</label>
            <input type="number" min="1" value={taskDays} onChange={e => setTaskDays(e.target.value)}
              placeholder="e.g. 3" style={inputStyle} />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
              <button onClick={() => setShowTaskModal(false)} style={{
                padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: "8px",
                backgroundColor: "#fff", fontSize: "13px", cursor: "pointer", color: "#6b7280",
              }}>Cancel</button>
              <button onClick={handleCreateTask} disabled={taskLoading} style={{
                padding: "8px 18px", border: "none", borderRadius: "8px",
                backgroundColor: "#7c3aed", color: "#fff", fontSize: "13px",
                fontWeight: 500, cursor: "pointer", opacity: taskLoading ? 0.7 : 1,
              }}>{taskLoading ? "Creating..." : "Create Task"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;