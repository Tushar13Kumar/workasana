import { useState, useEffect } from "react";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState(["", "", ""]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/teams");
      setTeams(res.data);
    };
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    try {
      const res = await API.post("/teams", { name: teamName, members: members.filter(m => m.trim()) });
      setTeams([...teams, res.data]);
      setTeamName(""); setMembers(["", "", ""]); setShowModal(false);
    } catch (e) { console.error(e); }
  };

  const colors = ["#ede9fe", "#dbeafe", "#dcfce7", "#fef9c3", "#fce7f3"];
  const textColors = ["#7c3aed", "#1d4ed8", "#15803d", "#a16207", "#be185d"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: 0 }}>Teams</h2>
          <button onClick={() => setShowModal(true)} style={{
            backgroundColor: "#7c3aed", color: "#fff", border: "none",
            borderRadius: "8px", padding: "9px 18px", fontSize: "13px",
            fontWeight: 500, cursor: "pointer",
          }}>+ New Team</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {teams.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>No teams yet.</p>
          ) : teams.map((team, i) => (
            <div key={team._id} style={{
              backgroundColor: "#fff", border: "1px solid #f3f4f6",
              borderRadius: "12px", padding: "20px",
            }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 12px" }}>{team.name}</h3>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(team.members || []).slice(0, 4).map((m, j) => (
                  <div key={j} style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    backgroundColor: colors[(j) % colors.length],
                    color: textColors[(j) % textColors.length],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 600,
                  }}>{(m.name || m)?.[0]?.toUpperCase() || "?"}</div>
                ))}
                {(team.members || []).length > 4 && (
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    backgroundColor: "#f3f4f6", color: "#6b7280",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 600,
                  }}>+{team.members.length - 4}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "420px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#111827" }}>Create New Team</h3>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9ca3af" }}>×</button>
              </div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Team Name</label>
              <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Enter team name"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", marginBottom: "16px", boxSizing: "border-box" }} />
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "8px" }}>Add Members</label>
              {members.map((m, i) => (
                <input key={i} value={m} onChange={e => { const arr = [...members]; arr[i] = e.target.value; setMembers(arr); }}
                  placeholder="Member name"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", marginBottom: "8px", boxSizing: "border-box" }} />
              ))}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button onClick={() => setShowModal(false)} style={{ padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#fff", fontSize: "13px", cursor: "pointer", color: "#6b7280" }}>Cancel</button>
                <button onClick={handleCreate} style={{ padding: "8px 18px", border: "none", borderRadius: "8px", backgroundColor: "#7c3aed", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>Create</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Teams;