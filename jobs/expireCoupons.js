const cron = require('node-cron');
const Coupon = require('../models/Coupon');

cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  try {
    const result = await Coupon.updateMany(
      { expireDate: { $lt: now }, status: { $ne: "expired" } },
      { status: "expired" }
    );
    console.log(`[CRON] Updated ${result.modifiedCount} expired coupons at ${now}`);
  } catch (error) {
    console.error("[CRON] Failed to update expired coupons:", error.message);
  }
});