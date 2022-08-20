const router = require("express").Router();
const {
  register,
  login,
  confirmAuth,
  contact,
} = require("../controllers/admins");
const { checkAdminAuth } = require("../middleware/adminAuth");
const { validateSendEmail, isValidated } = require("../middleware/validators");

// Admin Register
router.post("/", register);
router.post("/login", login);
router.get("/auth", checkAdminAuth, confirmAuth);
router.post("/contact", validateSendEmail, isValidated, contact);

module.exports = router;
