import {useState , useEffect} from "react"
import API from "../utils/axios"
import Navbar from "../components/Navbar";


const Tasks = () => {
    const [tasks , setTasks] = useState([]);
    useEffect(()=> {
        const fetchData = async() =>{
            const taskRes = await API.get("/tasks");
            setTasks(taskRes.data)
        }
        fetchData()
    } , [])
    const handleLogout = ()  => {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }
    const backToDashboard = () => {
        window.location.href = "/dashboard";
    }

    return(
        <div>
             <Navbar/>
        <h2>Tasks Page</h2>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={backToDashboard}>Bask To DashBoard</button>

        {tasks.map((task) => (
            <div key={task._id}>
                <p>Task Name: {task.name}</p>
                <p>Status: {task.status}</p>
                <p>Time to complete: {task.timeToComplete}</p>
            </div>
        ))}

        </div>
    )
}
export default Tasks