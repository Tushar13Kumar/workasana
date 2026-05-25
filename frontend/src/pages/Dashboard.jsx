import { useState, useEffect } from "react";
import API from "../utils/axios";
import Navbar from "../components/Navbar";


const statusColors = {
  "To Do": "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  "Completed": "bg-green-100 text-green-700",
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await API.get("/projects");
        setProjects(projRes.data);
        const taskRes = await API.get("/tasks");
        setTasks(taskRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredTasks = filter === "All"
    ? tasks
    : tasks.filter(t => t.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />

      <main className="ml-56 flex-1 p-8">
        {/* Search bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-xl bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 outline-none focus:border-purple-300"
          />
        </div>

        {/* Projects Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
            <button className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              + New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length === 0 ? (
              <p className="text-gray-400 text-sm">No projects yet</p>
            ) : (
              projects.map((proj) => (
                <div key={proj._id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow cursor-pointer">
                  <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">In Progress</span>
                  <h3 className="font-semibold text-gray-800 mt-3 mb-1">{proj.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{proj.description || "No description"}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
            <div className="flex gap-2">
              {["All", "In Progress", "Completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    filter === f
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length === 0 ? (
              <p className="text-gray-400 text-sm">No tasks found</p>
            ) : (
              filteredTasks.map((task) => (
                <div key={task._id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[task.status] || "bg-gray-100 text-gray-600"}`}>
                    {task.status}
                  </span>
                  <h3 className="font-semibold text-gray-800 mt-3 mb-1">{task.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Due on: {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date"}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center text-xs font-medium text-purple-700">
                      {task.owner?.name?.[0] || "?"}
                    </div>
                    <span className="text-xs text-gray-500">{task.owner?.name || "Unassigned"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;