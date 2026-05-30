const router = require("express").Router();
const Team = require("../models/Team");
const verifyToken = require("../middleware/auth");

// GET all teams
router.get("/", verifyToken, async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single team by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create team
router.post("/", verifyToken, async (req, res) => {
  const { name, description, members } = req.body;
  try {
    const existing = await Team.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Team already exists" });
    }
    const team = new Team({ name, description, members });
    await team.save();
    res.status(201).json(team);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH update team
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE team
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;