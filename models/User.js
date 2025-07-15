const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId:    { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  dob:       { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);