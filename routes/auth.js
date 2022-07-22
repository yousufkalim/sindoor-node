/**
 * User auth routes
 * @author Yousuf Kalim
 */
const router = require("express").Router();
const auth = require("../controllers/auth");
const { checkAuth } = require("../middleware/checkAuth");
const {
  validateLogin,
  isValidated,
  changePasswordValidate,
} = require("../middleware/validators");

/**
 ** Auth Routes
 * @method post user login
 * @method get check auth
 * @method put change password
 * @method post forgot email
 */

// Read
router.post("/login", auth.login); // Get all users at once

// check auth
router.get("/", checkAuth, auth.confirmAuth);

// Change password route
router.put(
  "/password/:userId",
  changePasswordValidate,
  isValidated,
  auth.changePassword
);
router.put("/forgot/:email", auth.forgot);

// Verify OTP
router.put("/verifyOtp/:userId", auth.verifyOTP);

// Resend OTP
router.put("/resendOtp/:userId", auth.resendOtp);

// Export
module.exports = router;
