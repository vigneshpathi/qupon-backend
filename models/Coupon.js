const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    couponId: { type: String, unique: true },
    userId: { type: String, required: true },
    categoryName: { type: String, required: true },
    brandName: { type: String, required: true },
    couponCode: { type: String, required: true, unique: true },
    expireDate: { type: Date, required: true },
    price: { type: Number, default: 0 },
    termsAndConditionImage: { type: String, required: true },

    status: {
        type: String,
        enum: ["not_verified", "approved", "rejected", "sold", "expired"],
        default: "not_verified"

    },
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
