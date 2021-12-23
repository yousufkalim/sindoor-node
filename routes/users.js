/**
 * User CRUD routes
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const router = require("express").Router();
const users = require("../controllers/users");
const { upload } = require("../middleware/multer");
const {
  validateUser,
  validateRole,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user signup
 * @method get get all users
 * @method get get user by id
 * @method put update user
 * @method delete delete user
 */

// Create - User Signup
router.post(
  "/",
  upload.single("image"),
  validateUser,
  isValidated,
  users.create
);

// Read
router.get("/:role", validateRole, isValidated, users.getAll); // Get all users according to roles

router.get("/:userId/:role", users.getById); // Get one user by it's id

// Update
router.put("/:userId/:role", validateRole, isValidated, users.update); // Update a specific user by it's id
// Delete
router.delete("/:userId/:role", validateRole, isValidated, users.delete); // delete a specific user by it's id

// Export
module.exports = router;
