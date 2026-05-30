const router = require("express").Router();
const verifyToken = require("../middleware/auth");
const Task = require("../models/Task");

// GET /report/last-week — last 7 days mein complete hue tasks
router.get("/last-week", verifyToken, async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const tasks = await Task.find({
      status: "Completed",
      updatedAt: { $gte: lastWeek },
    })
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name"); // ✅ owners (array) — owner nahi

    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /report/pending — incomplete tasks aur total pending days
router.get("/pending", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: "Completed" } })
      .populate("project", "name")
      .populate("team", "name");

    const totalDays = tasks.reduce((sum, task) => sum + (task.timeToComplete || 0), 0);

    res.status(200).json({ totalPendingdays: totalDays, tasks });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /report/completed — saare completed tasks
router.get("/completed", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Completed" })
      .populate("team", "name")
      .populate("project", "name")
      .populate("owners", "name"); // ✅ Fix: owners nahi owner

    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /report/by-team — har team ke completed tasks ki count (chart ke liye)
router.get("/by-team", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Completed" })
      .populate("team", "name");

    // Group by team
    const teamMap = {};
    tasks.forEach(task => {
      const teamName = task.team?.name || "Unknown";
      teamMap[teamName] = (teamMap[teamName] || 0) + 1;
    });

    const result = Object.entries(teamMap).map(([name, count]) => ({ name, count }));
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /report/by-owner — har owner ke completed tasks ki count (chart ke liye)
router.get("/by-owner", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Completed" })
      .populate("owners", "name");

    // Group by owner
    const ownerMap = {};
    tasks.forEach(task => {
      const owners = task.owners?.length ? task.owners : [];
      if (owners.length === 0) {
        ownerMap["Unassigned"] = (ownerMap["Unassigned"] || 0) + 1;
      } else {
        owners.forEach(o => {
          const name = o?.name || "Unknown";
          ownerMap[name] = (ownerMap[name] || 0) + 1;
        });
      }
    });

    const result = Object.entries(ownerMap).map(([name, count]) => ({ name, count }));
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;