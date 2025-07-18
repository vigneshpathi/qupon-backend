const Coupon = require("../models/Coupon");
const User = require("../models/User");
const updateUserLevel = require("../utils/updateUserLevel");


const getCouponsByCategory = async (req, res) => {
    const { categoryName } = req.query;

    try {
        const coupons = await Coupon.find({ categoryName });

        if (coupons.length === 0) {
            return res.status(404).json({ message: "No coupons found for this category" });
        }

        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}, 'couponId userId brandName couponCode expireDate price termsAndConditionImage');
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addCoupon = async (req, res) => {
    const {
        userId,
        categoryName,
        brandName,
        couponCode,
        expireDate,
        termsAndConditionImage
    } = req.body;

    try {
        if (!termsAndConditionImage) {
            return res.status(400).json({ message: "Terms & Conditions image URL is required" });
        }

        if (!userId || !categoryName) {
            return res.status(400).json({ message: "userId and categoryName are required" });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please register first." });
        }

        // ✅ Daily limit check (7 per day)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const uploadsToday = await Coupon.countDocuments({
            userId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        if (uploadsToday >= 7) {
            return res.status(403).json({ message: "Daily upload limit (7) reached. Try again tomorrow." });
        }

        const codeExists = await Coupon.findOne({ couponCode });
        if (codeExists) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const totalCoupons = await Coupon.countDocuments();
        const newCouponId = `COUP${(totalCoupons + 1).toString().padStart(3, '0')}`;

        const coupon = await Coupon.create({
            couponId: newCouponId,
            userId,
            categoryName,
            brandName,
            couponCode,
            expireDate,
            termsAndConditionImage,
            status: "not_verified",
        });

        await User.updateOne({ userId }, { $inc: { totalCouponsUploaded: 1 } });

        await updateUserLevel(userId);

        res.status(201).json({ message: "Coupon created successfully", data: coupon });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCouponStatus = async (req, res) => {
    const { couponId, status } = req.query;

    // validate inputs
    const allowedStatuses = ["approved", "rejected"];
    if (!couponId || !status) {
        return res.status(400).json({ message: "couponId and status are required in query" });
    }
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}` });
    }

    try {
        const coupon = await Coupon.findOneAndUpdate(
            { couponId },
            { status },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.status(200).json({ message: `Coupon ${status}`, data: coupon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCouponById = async (req, res) => {
    const { couponId } = req.params;

    if (!couponId) {
        return res.status(400).json({ message: "Coupon ID is required" });
    }

    try {
        const coupon = await Coupon.findOne({ couponId });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editCoupon = async (req, res) => {
    const { couponId } = req.params;
    const updates = req.body;

    try {
        const coupon = await Coupon.findOneAndUpdate(
            { couponId },
            updates,
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.status(200).json({ message: "Coupon updated successfully", data: coupon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCouponsByUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const coupons = await Coupon.find({ userId });

        if (coupons.length === 0) {
            return res.status(404).json({ message: "No coupons found for this user" });
        }

        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addCoupon,
    getAllCoupons,
    getCouponsByCategory,
    updateCouponStatus,
    getCouponById,
    editCoupon,
    getCouponsByUser
};