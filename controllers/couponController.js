const Coupon = require("../models/Coupon");


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
    const coupons = await Coupon.find({}, 'couponId userId brandName couponCode expireDate percentage termsAndConditionImage');
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addCoupon = async (req, res) => {
    const { userId, categoryName, brandName, couponCode, expireDate, percentage } = req.body;
    const image = req.file;

    try {
        if (!image) {
            return res.status(400).json({ message: "Terms & Conditions image is required" });
        }

        if (!userId || !categoryName) {
            return res.status(400).json({ message: "userId is required" });
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
            percentage,
            termsAndConditionImage: image.path
        });

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

module.exports = { addCoupon,
    getAllCoupons,
    getCouponsByCategory,
    updateCouponStatus
 };