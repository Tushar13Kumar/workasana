import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "⊞" },
  { to: "/projects", label: "Project", icon: "▤" },
  { to: "/teams", label: "Team", icon: "👥" },
  { to: "/reports", label: "Reports", icon: "📊" },
    { to: "/tasks", label: "Tasks", icon: "▤" },
  
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0,
      height: "100vh", width: "220px",
      backgroundColor: "#ffffff",
      borderRight: "1px solid #e5e7eb",
      display: "flex", flexDirection: "column",
      padding: "24px 16px",
      zIndex: 100,
    }}>
      <div style={{ marginBottom: "32px" }}>
        <span style={{ color: "#7c3aed", fontWeight: 700, fontSize: "20px" }}>workasana</span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {navItems.map(({ to, label, icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "8px", textDecoration: "none",
              fontSize: "14px", fontWeight: 500,
              backgroundColor: active ? "#ede9fe" : "transparent",
              color: active ? "#7c3aed" : "#4b5563",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = "#f5f3ff"; e.currentTarget.style.color = "#7c3aed"; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#4b5563"; }}}
            >
              <span style={{ fontSize: "16px" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout} style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "9px 12px", borderRadius: "8px",
        backgroundColor: "transparent", border: "none",
        color: "#ef4444", fontSize: "14px", fontWeight: 500,
        cursor: "pointer", width: "100%",
      }}>
        🚪 Logout
      </button>
    </aside>
  );
};

export default Navbar;