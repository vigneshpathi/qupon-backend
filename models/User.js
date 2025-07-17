const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    userLevel: { type: Number, default: 1 },
    prepaymentPercentage: { type: Number, default: 0 },
    totalCouponsUploaded: { type: Number, default: 0 },
    couponsUploadedToday: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
