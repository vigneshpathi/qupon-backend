const express = require("express");
const router = express.Router();
const { addCoupon, getAllCoupons, getCouponsByCategory, updateCouponStatus, getCouponById, editCoupon, getCouponsByUser } = require("../controllers/couponController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("termsAndConditionImage"), addCoupon);
router.get("/", getAllCoupons);
router.get("/category", getCouponsByCategory);
router.get("/:couponId", getCouponById); 
router.put('/update-status', updateCouponStatus);
router.put("/:couponId", editCoupon);
router.get("/user/:userId", getCouponsByUser);


module.exports = router;