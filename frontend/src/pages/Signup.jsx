import { useState } from "react";
import API from "../utils/axios"

const Signup =() => {
    const [name , setName] = useState("");
    const [email , setEMail] = useState("")
    const [password , setPassword] = useState("")
    const [error , setError] = useState("")

    const handleSignup = async () => {
        try{
         const request = await API.post("/auth/signup" , {name , email , password})
         localStorage.setItem("token" , request.data.token)
         window.location.href = "/login"
        }catch(error){

                 setError("Invalid Email and Password")
        }
    }

    return(
        <div>
            <h2>Signup to worksana</h2>
            {error &&  <p style={{color: "red"}}>{error}</p> }
            <input type="text" onChange={(e) => setName(e.target.value)  } placeholder="Name" />
            <input type="email" onChange={(e) => setEMail(e.target.value) } placeholder="Email" />
            <input type="password" onChange={(e) => setPassword(e.target.value) } placeholder="Password" />
            <button onClick={handleSignup}>Signup</button>
            <p>Have Account ? <a href="/login">Login</a></p>

        </div>
    )
}

export default Signup