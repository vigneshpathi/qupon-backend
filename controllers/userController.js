const User = require('../models/User');

const registerUser = async (req, res) => {
  const { firstName, lastName, email, dob } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Get total number of existing users to generate incremental ID
    const totalUsers = await User.countDocuments();
    const newUserId = `USER${(totalUsers + 1).toString().padStart(3, '0')}`; // USER001, USER002...

    const user = await User.create({
      userId: newUserId,
      firstName,
      lastName,
      email,
      dob
    });

    res.status(201).json({
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser };