import { useState , useEffect } from "react";
import API from "../utils/axios"
import Navbar from "../components/Navbar";
const Projects = () => {
    const [projects , setprojects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const projectRes = await API.get("/projects")
            setprojects(projectRes.data)
        }
        fetchData()
    } , [])
    const handleLogOut = () => {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }
    return(
        <div>
             <Navbar/>
            <h1>WORKSONA PROJECT</h1>

            <button onClick={handleLogOut}>Logout</button>

            <h2>Projects</h2>
            {projects.map((project) => (
                <div key={project._id}>
                    <p>Project name: {project.name}</p>
                    <p>Project Description: {project.description}</p>
                    <p>Date: {project.createdAt}</p>
                </div>
            ))}
        </div>
    )
}
export default Projects