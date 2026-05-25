import { useState , useEffect } from "react";
import API from   "../utils/axios"
import Navbar from "../components/Navbar";


const Teams = () => {
    const [teams , setTeams] = useState([])

    useEffect(() => {
        const fetchData = async() => {
            const teamRes = await API.get("/teams")
            setTeams(teamRes.data) 
        }
        fetchData()
    } , [])

    return(
        <div>
            <Navbar/>
            <h1>Worksona Team</h1>
            {teams.map((team) => (
                <div key={team._id}>
                    <p>Name: {team.name}</p>
                    <p>Description: {team.description}</p>
                </div>
            ))}
        </div>
    )
}
export default Teams