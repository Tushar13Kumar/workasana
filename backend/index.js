const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const authRoutes = require("./routes/auth")
const teamRoutes = require("./routes/teams")
const projectRoutes = require("./routes/projects")
const taskRoutes = require("./routes/tasks")
const reportRoutes = require("./routes/reports")

const app = express();

app.use(cors());
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/teams", teamRoutes)
app.use("/projects", projectRoutes)
app.use("/tasks" , taskRoutes)
app.use("/report" , reportRoutes )


app.get("/", (req, res) => {
    res.json({message: "workasana backend is running"})
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongodb is connected")
    app.listen(3001, () => console.log("server is running"))
  }).catch((err) => console.log("DB connection err:", err))