import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-4 z-10">
      <div className="mb-8">
        <span className="text-purple-600 font-semibold text-xl tracking-tight">workasana</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 text-sm font-medium transition-colors">
          <span>⊞</span> Dashboard
        </Link>
        <Link to="/projects" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 text-sm font-medium transition-colors">
          <span>☰</span> Project
        </Link>
        <Link to="/teams" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 text-sm font-medium transition-colors">
          <span>👥</span> Team
        </Link>
        <Link to="/reports" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 text-sm font-medium transition-colors">
          <span>📊</span> Reports
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 text-sm font-medium transition-colors">
          <span>⚙️</span> Settings
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 text-sm font-medium transition-colors mt-auto"
      >
        <span>🚪</span> Logout
      </button>
    </aside>
  );
};

export default Navbar;