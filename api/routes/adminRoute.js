// adminRoute.js

const express = require("express");
const {
  blockUserController,
  unblockUserController,
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Define routes with corresponding controllers and middlewares
router.get("/getAllUsers", authMiddleware, roleMiddleware(['admin']), getAllUsersController); // Get all users, only accessible by admins
router.get("/getAllDoctors", authMiddleware, roleMiddleware(['admin', 'doctor']), getAllDoctorsController); // Get all doctors, accessible by admins and doctors
router.post("/changeAccountStatus", authMiddleware, roleMiddleware(['admin']), changeAccountStatusController); // Change account status, only accessible by admins
router.post("/blockUser", authMiddleware, roleMiddleware(['admin']), blockUserController); // Block a user, only accessible by admins
router.post("/unblockUser", authMiddleware, roleMiddleware(['admin']), unblockUserController); // Unblock a user, only accessible by admins

module.exports = router;
