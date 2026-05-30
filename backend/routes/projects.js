const router = require("express").Router();
const Project = require("../models/Project");
const verifyToken = require("../middleware/auth");

// GET all projects
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single project by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create project
router.post("/", verifyToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    const existing = await Project.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Project name already taken" });
    }
    const project = new Project({ name, description });
    await project.save();
    res.status(201).json(project);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH update project
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE project
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;