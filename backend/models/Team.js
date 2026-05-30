const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  // members can be stored as strings (names) or ObjectId refs to User
  members: [{ type: String }],
});

module.exports = mongoose.model("Team", teamSchema);