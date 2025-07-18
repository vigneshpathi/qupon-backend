const express = require("express");
const router = express.Router();
const { registerUser, updateUserProfile, getAllUsers, deleteUser, getUserByEmail } = require("../controllers/userController");

router.post("/register", registerUser);
router.put("/profile/:userId",updateUserProfile);
router.get("/search",getUserByEmail);
router.delete("/:userId", deleteUser);
router.get("/", getAllUsers);
module.exports = router;