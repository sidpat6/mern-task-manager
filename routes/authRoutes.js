const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/authController");
const roleCheck = require("../middleware/roleMiddleware");

const auth = require("../middleware/auth");
const {register,login,getProfile,changePassword,updateProfile} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, getProfile);
router.put("/change-password", auth, changePassword);

router.put("/update-profile", auth, updateProfile);
router.get("/users", auth, roleCheck(["superadmin"]), getUsers);
router.post("/create-user", auth, roleCheck(["superadmin"]), createUser);

module.exports = router;
