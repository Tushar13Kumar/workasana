import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/projects", { name, description });
      setProjects([...projects, res.data]);
      setName("");
      setDescription("");
      setShowModal(false);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px", minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: 0 }}>Projects</h2>
          <button onClick={() => { setError(""); setShowModal(true); }} style={{
            backgroundColor: "#7c3aed", color: "#fff", border: "none",
            borderRadius: "8px", padding: "9px 18px", fontSize: "13px",
            fontWeight: 500, cursor: "pointer",
          }}>+ New Project</button>
        </div>

        {/* Project Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {projects.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>No projects yet. Create one!</p>
          ) : projects.map((proj) => (
            <div key={proj._id}
              onClick={() => navigate(`/projects/${proj._id}`)}
              style={{
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
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 12px" }}>{proj.description || "No description"}</p>
              <p style={{ fontSize: "11px", color: "#d1d5db" }}>
                {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
              </p>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showModal && (
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
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9ca3af" }}>×</button>
              </div>
              {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Project Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter project name"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", marginBottom: "16px", boxSizing: "border-box" }} />
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Project Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter project description" rows={3}
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", outline: "none", marginBottom: "20px", boxSizing: "border-box", resize: "none" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setShowModal(false)} style={{ padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#fff", fontSize: "13px", cursor: "pointer", color: "#6b7280" }}>Cancel</button>
                <button onClick={handleCreate} disabled={loading} style={{ padding: "8px 18px", border: "none", borderRadius: "8px", backgroundColor: "#7c3aed", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;