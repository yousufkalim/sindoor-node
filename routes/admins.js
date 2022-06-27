const router = require("express").Router();
const {
  register,
  login,
  confirmAuth,
  contact,
} = require("../controllers/admins");
const { checkAdminAuth } = require("../middleware/adminAuth");

// Admin Register
router.post("/", register);
router.post("/login", login);
router.get("/auth", checkAdminAuth, confirmAuth);
router.post("/contact", contact);

module.exports = router;
