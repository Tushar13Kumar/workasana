const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  owners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tags: [{ type: String }],
  timeToComplete: { type: Number, required: true, default: 1 },
  // ✅ dueDate field add kiya — pehle missing tha
  dueDate: { type: Date },
  // ✅ priority field add kiya
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed", "Blocked"],
    default: "To Do",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ✅ Auto-update updatedAt on every save/update
taskSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model("Task", taskSchema);