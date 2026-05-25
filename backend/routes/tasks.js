const router = require("express").Router();
const Task = require("../models/Task");
const verifyToken = require("../middleware/auth");

// ==========================================
// POST /tasks — Naya task banao
// ==========================================
router.post("/", verifyToken, async (req, res) => {
  // Frontend se yeh sab aayega
  const { name, project, team, owners, tags, timeToComplete, status } = req.body;

  // Naya task object banao
  const task = new Task({
    name,
    project,   // Project ki ID
    team,      // Team ki ID
    owners,    // Users ki IDs ka array
    tags,      // Strings ka array ["Urgent", "Bug"]
    timeToComplete,
    status     // "To Do", "In Progress" etc
  });

  await task.save();
  res.status(201).json(task);
});

// ==========================================
// GET /tasks — Saare tasks lao (filtering ke saath)
// ==========================================
router.get("/", verifyToken, async (req, res) => {
  // URL se query parameters lo
  // Example: /tasks?status=Completed&team=xxxxx
  const { status, team, project, owner, tags } = req.query;

  // filter object banao — sirf wahi fields add karo jo URL mein hain
  const filter = {};

  if (status) filter.status = status;
  // Agar URL mein ?status=Completed hai toh sirf completed tasks aayenge

  if (team) filter.team = team;
  // Agar URL mein ?team=teamId hai toh us team ke tasks aayenge

  if (project) filter.project = project;
  // Agar URL mein ?project=projectId hai toh us project ke tasks aayenge

  if (owner) filter.owners = owner;
  // Agar URL mein ?owner=userId hai toh us owner ke tasks aayenge

  if (tags) filter.tags = { $in: tags.split(",") };
  // $in = array mein se koi bhi match kare
  // "Urgent,Bug" → ["Urgent", "Bug"] split karo

  // populate = ID ki jagah poora object lao
  // Jaise team ID ki jagah team ka naam aur details aayenge
  const tasks = await Task.find(filter)
  .populate("project" , "name")
  .populate("team" , "name")
  .populate("owners" , "name email")
  res.status(201).json(tasks)
});

// ==========================================
// GET /tasks/:id — Ek specific task lao
// ==========================================
router.get("/:id", verifyToken, async (req, res) => {
  // :id = URL mein jo bhi id aaye — req.params.id mein milegi
  const task = await Task.findById(req.params.id)
    .populate("project", "name")
    .populate("team", "name")
    .populate("owners", "name email");

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});

// ==========================================
// PATCH /tasks/:id — Task update karo
// ==========================================
router.patch("/:id", verifyToken, async (req, res) => {
  // { new: true } = updated document wapas bhejo
  // req.body = jo bhi fields update karni hain
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});

// ==========================================
// DELETE /tasks/:id — Task delete karo
// ==========================================
router.delete("/:id", verifyToken, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json({ message: "Task deleted successfully" });
});

module.exports = router;