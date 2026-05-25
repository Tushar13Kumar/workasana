import {useState , useEffect} from "react"
import API from "../utils/axios"
import Navbar from "../components/Navbar"

const Reports = () => {
    const [pending , setPending] = useState([])
    const [complete , setComplete] = useState([])

    
    useEffect(() => {
        const fetchData = async() => {
        const pendingRes = await API.get("/report/pending")
        const completeRes = await API.get("/report/completed")
        setPending(pendingRes.data)
        setComplete(completeRes.data)
    }
    fetchData()
    } , [])

    return(
        <div>
             <Navbar/>
            <h2>Worksona Report</h2>
            <h3>Pending Daya</h3>
            {pending && (<p>Total Pending Days: {pending.totalPendingdays}</p>) }

            <h3>Completed Task</h3>
            {complete.map((task) => (
            <div key={task._id}>
                <p>Task: {task.name}</p>
                <p>Status: {task.status}</p>
            </div>
            ) )}
        </div>
    )
    
}
export default Reports