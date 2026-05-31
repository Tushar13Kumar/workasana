const router = require("express").Router();
const Tag = require("../models/Tag");
const verifyToken = require("../middleware/auth");

// GET /tags — saare tags lao
router.get("/", verifyToken, async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.status(200).json(tags);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /tags — naya tag banao
router.post("/", verifyToken, async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ message: "Tag name is required" });
  }
  try {
    const existing = await Tag.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Tag already exists" });
    }
    const tag = new Tag({ name: name.trim() });
    await tag.save();
    res.status(201).json(tag);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;