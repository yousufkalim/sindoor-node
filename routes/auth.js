/**
 * User auth routes
 * @author Yousuf Kalim
 * @codeBy Shuja Naqvi
 */
const router = require("express").Router();
const auth = require("../controllers/auth");
const {
  validateLogin,
  validateRole,
  isValidated,
  changePasswordValidate,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user login
 */

// Read
router.post("/login", validateLogin, isValidated, auth.login); // Get all users at once
router.put(
  "/password/:userId/:role",
  changePasswordValidate,
  validateLogin,
  isValidated,
  auth.changePassword
); // Change password route
router.put("/forgot/:role/:email", validateRole, isValidated, auth.forgot);

// Export
module.exports = router;
