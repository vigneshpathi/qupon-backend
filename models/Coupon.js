const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    couponId: { type: String, unique: true },
    userId: { type: String, required: true },
    categoryName: { type: String, required: true },
    brandName: { type: String, required: true },
    couponCode: { type: String, required: true, unique: true },
    expireDate: { type: Date, required: true },
    percentage: { type: Number, required: true },
    termsAndConditionImage: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
