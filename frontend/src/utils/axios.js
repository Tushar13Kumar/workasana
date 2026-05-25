import axios from "axios"

const API = axios.create({baseURL: "https://workasana-6a2n.onrender.com"})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = token
    }
    return config
})
export default API
