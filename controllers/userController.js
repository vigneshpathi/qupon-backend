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
  registerUser,
  getAllUsers,
  updateUserProfile,
  deleteUser,
  getUserByEmail,
};