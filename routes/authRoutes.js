const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {register,login,getProfile,changePassword} = require("../controllers/authController");
// const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, getProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;

// // const auth = require("../middleware/auth");

// router.post("/register", register);
// router.post("/login", login);


// router.get("/me", auth, require("../controllers/authController").getProfile);
// router.put("/change-password", auth, require("../controllers/authController").changePassword);
// // router.put("/change-password", auth, require("../controllers/authController").changePassword);

// module.exports = router;
