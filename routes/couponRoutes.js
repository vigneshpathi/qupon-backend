const express = require("express");
const router = express.Router();
const {
  addCoupon,
  getAllCoupons,
  getCouponsByCategory,
  updateCouponStatus,
  getCouponById,
  editCoupon,
  getCouponsByUser,
} = require("../controllers/couponController");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Add a new coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryId
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               userId:
 *                 type: string
 *               description:
 *                 type: string
 *               termsAndConditionImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Coupon created successfully
 */
router.post("/", upload.single("termsAndConditionImage"), addCoupon);

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: List of all coupons
 */
router.get("/", getAllCoupons);

/**
 * @swagger
 * /coupons/category:
 *   get:
 *     summary: Get coupons by category
 *     tags: [Coupons]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Coupons in the specified category
 */
router.get("/category", getCouponsByCategory);

/**
 * @swagger
 * /coupons/update-status:
 *   put:
 *     summary: Update coupon status (approve/reject)
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               couponId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Coupon status updated
 */
router.put("/update-status", updateCouponStatus);

/**
 * @swagger
 * /coupons/{couponId}:
 *   get:
 *     summary: Get coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the coupon
 *     responses:
 *       200:
 *         description: Coupon details
 */
router.get("/:couponId", getCouponById);

/**
 * @swagger
 * /coupons/{couponId}:
 *   put:
 *     summary: Edit a specific coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 */
router.put("/:couponId", editCoupon);

/**
 * @swagger
 * /coupons/user/{userId}:
 *   get:
 *     summary: Get all coupons uploaded by a specific user
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's coupons
 */
router.get("/user/:userId", getCouponsByUser);

module.exports = router;
