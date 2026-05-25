import { useState } from "react";
import API from "../utils/axios"

const Login = () => {
    const [email , setMail] = useState("")
    const [password , setPassword] = useState("")
    const [error , setError] = useState("")

    const handleLogin =  async() => {
        try{
            const response = await API.post("/auth/login" , {email , password})
            localStorage.setItem("token" , response.data.token)
            window.location.href = "/dashboard";
        }catch(err){
            setError("Invalid email and password")
        }
    }

    return(
        <div>
            <h2>Login to Worksana</h2>
            {error && <p style={{color:"red"}}>{error}</p>}
            <input type="email" onChange={(e) => setMail(e.target.value)} placeholder="email"/>
            <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
            <button onClick={handleLogin}>Login</button>
            <p>No Account ? <a href="/signup">Signup</a> </p>
        </div>
    )

}

export default Login