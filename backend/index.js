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

// ✅ CORS — sirf ek baar, sahi tarike se
app.use(cors({
  origin: ["https://workasana-six.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/report", reportRoutes);

app.get("/", (req, res) => {
  res.json({ message: "workasana backend is running" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3001, () => console.log("Server running on port 3001"));
  })
  .catch((err) => console.log("DB connection error:", err));