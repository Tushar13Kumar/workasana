import {useState , useEffect} from "react";
import API from "../utils/axios";
import Navbar from "../components/Nasvigate";

const Dashboard = () => {
    const [projects , setProjects] = useState([]);
    const [tasks , setTasks] = useState([]);
    useEffect(() => {
        const fetchData = async() => {
            const projectRes = await API.get("/projects");
            const tasksRes = await API.get("/tasks")
            setProjects(projectRes.data);
            setTasks(tasksRes.data);

        }
        fetchData()
    }, [])
    const handleLogOut = () => {
        localStorage.removeItem("token")
        window.location.href= "/login"
    }
    return(
     <div>
        <Navbar/>
        <h1>WORKSONA DASHBOARD</h1>

        <button onClick={handleLogOut}>Logout</button>

        <h2>Projects</h2>
        {projects.map((project) => (
            <div key={project._id}>
            <p>{project.name}</p>
            <p>{project.description}</p>
            </div>
    ))}

    <h2>Tasks</h2>
    {tasks.map((task) => (
        <div key={task._id}>
            <p>{task.name}</p>
            <p>Status: {task.status}</p>
        </div>
    ))}


   </div> )
    
}
export default Dashboard