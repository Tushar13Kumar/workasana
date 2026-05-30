import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#ede9fe", "#dbeafe", "#dcfce7", "#fef9c3", "#fce7f3"];
  const textColors = ["#7c3aed", "#1d4ed8", "#15803d", "#a16207", "#be185d"];

  const statusColors = {
    "To Do": { bg: "#dbeafe", color: "#1d4ed8" },
    "In Progress": { bg: "#fef9c3", color: "#a16207" },
    "Completed": { bg: "#dcfce7", color: "#15803d" },
    "Blocked": { bg: "#fee2e2", color: "#dc2626" },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, taskRes] = await Promise.all([
          API.get(`/teams/${id}`),
          API.get(`/tasks?team=${id}`),
        ]);
        setTeam(teamRes.data);
        setTasks(taskRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9ca3af" }}>Loading...</p>
      </main>
    </div>
  );

  if (!team) return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        <p style={{ color: "#ef4444" }}>Team not found.</p>
        <button onClick={() => navigate("/teams")} style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
          ← Back to Teams
        </button>
      </main>
    </div>
  );

  const members = team.members || [];
  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const inProgressCount = tasks.filter(t => t.status === "In Progress").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        {/* Back */}
        <button onClick={() => navigate("/teams")} style={{
          background: "none", border: "none", color: "#7c3aed",
          fontSize: "13px", fontWeight: 500, cursor: "pointer",
          padding: 0, marginBottom: "20px",
        }}>← Back to Teams</button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>

          {/* Left */}
          <div>
            {/* Team Header */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{team.name}</h1>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 24px" }}>{team.description || "No description"}</p>

              {/* Stats */}
              <div style={{ display: "flex", gap: "16px" }}>
                {[
                  { label: "Members", value: members.length, bg: "#ede9fe", color: "#7c3aed" },
                  { label: "Total Tasks", value: tasks.length, bg: "#f9fafb", color: "#111827" },
                  { label: "In Progress", value: inProgressCount, bg: "#fef9c3", color: "#a16207" },
                  { label: "Completed", value: completedCount, bg: "#dcfce7", color: "#15803d" },
                ].map(stat => (
                  <div key={stat.label} style={{ backgroundColor: stat.bg, borderRadius: "10px", padding: "14px 20px", flex: 1, textAlign: "center" }}>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827" }}>Team Tasks</h3>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {["Task", "Project", "Status", "Due Date"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>No tasks assigned to this team</td></tr>
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
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{task.project?.name || "—"}</td>
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
          </div>

          {/* Members Panel */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "24px", alignSelf: "start" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>Members ({members.length})</h3>
            {members.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No members yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {members.map((member, i) => {
                  const name = member.name || member;
                  const initial = (typeof name === "string" ? name : "?")[0]?.toUpperCase();
                  return (
                    <div key={member._id || i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        backgroundColor: colors[i % colors.length],
                        color: textColors[i % textColors.length],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", fontWeight: 600, flexShrink: 0,
                      }}>{initial || "?"}</div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 500, color: "#111827", margin: 0 }}>{name}</p>
                        {member.email && <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{member.email}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamDetail;