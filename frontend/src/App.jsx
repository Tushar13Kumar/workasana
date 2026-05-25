import {BrowserRouter , Routes , Route} from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Projects from "./pages/Projects"
import Teams from "./pages/Teams"
import Reports from "./pages/Reports"

const App = () => {
  return(
    <BrowserRouter>
     <Routes>
       <Route  path="/" element={<Login/>}/>
      <Route  path="/login" element={<Login/>}/>
      <Route  path="/signup" element={<Signup/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/tasks" element={<Tasks/>}/>
      <Route path="/projects" element={<Projects/>}/>
      <Route path="/teams" element={<Teams/>}/>
      <Route path="/reports" element={<Reports/>}/>




       
     </Routes>
    </BrowserRouter>
  )
}

export default App;