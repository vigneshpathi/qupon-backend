const express = require("express");
const router = express.Router();
const { 
  createUserWithPhone,
  completeUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  deleteUser, 
  getUserByEmail 
} = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /users/phone:
 *   post:
 *     summary: Create a new user with phone number
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdToken:
 *                 type: string
 *                 example: "abcd#89"
 *     responses:
 *       200:
 *         description: Phone number saved successfully
 *       400:
 *         description: Bad request
 */
router.post("/phone", createUserWithPhone);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Complete registration by adding user profile details
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       404:
 *         description: Phone number not found
 */
router.post("/register", completeUserProfile);

/**
 * @swagger
 * /users/profile/{userId}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: User profile updated
 */
router.put("/profile/:userId", updateUserProfile);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search for a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email to search for
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/search", getUserByEmail);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/:userId", deleteUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", getAllUsers);

module.exports = router;
