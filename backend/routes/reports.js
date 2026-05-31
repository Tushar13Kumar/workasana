const router = require("express").Router();
const verifyToken = require("../middleware/auth");
const Task = require("../models/Task");

// GET /report/last-week
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
      .populate("owners", "name");
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /report/pending
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

// GET /report/completed
router.get("/completed", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Completed" })
      .populate("team", "name")
      .populate("project", "name")
      .populate("owners", "name");
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /report/by-team
router.get("/by-team", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Completed" }).populate("team", "name");
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

// GET /report/by-owner
router.get("/by-owner", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Completed" }).populate("owners", "name");
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

// ✅ GET /report/closed-tasks — spec ka required endpoint
// team, owner, ya project se group karke closed tasks count karo
router.get("/closed-tasks", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Completed" })
      .populate("team", "name")
      .populate("project", "name")
      .populate("owners", "name");

    // Group by team
    const byTeam = {};
    tasks.forEach(task => {
      const name = task.team?.name || "Unknown";
      byTeam[name] = (byTeam[name] || 0) + 1;
    });

    // Group by owner
    const byOwner = {};
    tasks.forEach(task => {
      const owners = task.owners?.length ? task.owners : [];
      if (owners.length === 0) {
        byOwner["Unassigned"] = (byOwner["Unassigned"] || 0) + 1;
      } else {
        owners.forEach(o => {
          const name = o?.name || "Unknown";
          byOwner[name] = (byOwner[name] || 0) + 1;
        });
      }
    });

    // Group by project
    const byProject = {};
    tasks.forEach(task => {
      const name = task.project?.name || "Unknown";
      byProject[name] = (byProject[name] || 0) + 1;
    });

    res.status(200).json({
      byTeam: Object.entries(byTeam).map(([name, count]) => ({ name, count })),
      byOwner: Object.entries(byOwner).map(([name, count]) => ({ name, count })),
      byProject: Object.entries(byProject).map(([name, count]) => ({ name, count })),
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;