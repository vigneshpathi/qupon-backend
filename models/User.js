const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  phone: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, sparse: true },
  dob: Date,
  userLevel: { type: Number, default: 1 },
  prepaymentPercentage: { type: Number, default: 0 },
  totalCouponsUploaded: { type: Number, default: 0 },
  couponsUploadedToday: { type: Number, default: 0 },
  isProfileCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
