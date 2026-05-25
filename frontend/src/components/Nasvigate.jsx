import {useNavigate} from "react-router-dom"


const Navbar = () => {
    const navigate = useNavigate()

    const handleLogOut = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }
    return(
        <nav>
            <h2>Worksona Project</h2>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/projects")}>Projects</button>
            <button onClick={() => navigate("/tasks")}>Tasks</button>
            <button onClick={() => navigate("/teams")}>Teams</button>
            <button onClick={() => navigate("/reports")}>Reports</button>
            <button onClick={handleLogOut}>LogOut</button>
        </nav>
    )
}

export default Navbar


