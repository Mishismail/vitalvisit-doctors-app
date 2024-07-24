const express = require("express");
const {
  blockUserController,
  unblockUserController, // Add this line
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/getAllUsers", authMiddleware, roleMiddleware(['admin']), getAllUsersController);
router.get("/getAllDoctors", authMiddleware, roleMiddleware(['admin', 'doctor']), getAllDoctorsController);
router.post("/changeAccountStatus", authMiddleware, roleMiddleware(['admin']), changeAccountStatusController);
router.post("/blockUser", authMiddleware, roleMiddleware(['admin']), blockUserController);
router.post("/unblockUser", authMiddleware, roleMiddleware(['admin']), unblockUserController); // Add this line

module.exports = router;
