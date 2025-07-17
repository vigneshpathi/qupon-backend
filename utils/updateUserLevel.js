const User = require("../models/User");

async function updateUserLevel(userId) {
  const user = await User.findOne({ userId });

  if (!user) return;

  let newLevel = 1;
  let prepayment = 0;
  let dailyLimit = 7;

  if (user.totalCouponsUploaded >= 100) {
    newLevel = 3;
    prepayment = 3;
    dailyLimit = Infinity;
  } else if (user.totalCouponsUploaded >= 50) {
    newLevel = 2;
    prepayment = 1;
    dailyLimit = 7;
  }

  user.userLevel = newLevel;
  user.prepaymentPercentage = prepayment;
  user.dailyUploadLimit = dailyLimit;

  await user.save();
}

module.exports = updateUserLevel;
