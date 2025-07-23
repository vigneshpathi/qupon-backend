const User = require('../models/User');

const createUserWithPhone = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Firebase ID token is required" });
  }

  try {
    // 1. Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phone = decodedToken.phone_number;

    if (!phone) {
      return res.status(400).json({ message: "Invalid token: Phone number not found" });
    }

    // 2. Check if user already exists
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(200).json({ message: "Phone already exists", data: user });
    }

    // 3. Create new user with custom userId
    const totalUsers = await User.countDocuments();
    const newUserId = `USER${(totalUsers + 1).toString().padStart(3, '0')}`;

    user = await User.create({ phone, userId: newUserId });

    return res.status(201).json({ message: "User registered", data: user });

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized or invalid token", error: err.message });
  }
};

const completeUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email, dob } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.dob = dob || user.dob;
    user.isProfileCompleted = true;

    await user.save();

    res.status(200).json({ message: "Profile completed", data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v -_id -createdAt -updatedAt");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email, dob } = req.body;

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (dob) user.dob = dob;

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email query is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOneAndDelete({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createUserWithPhone,
  completeUserProfile,
  getAllUsers,
  updateUserProfile,
  deleteUser,
  getUserByEmail,
};