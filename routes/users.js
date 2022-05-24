/**
 * User & Service Provider CRUD routes
 * @author Yousuf Kalim
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const users = require("../controllers/users");
const { upload } = require("../middleware/multer");
const {
  validateUser,
  validateUserUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 ** User Routes
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
router.get("/", users.getAll); // Get all users at once
router.get("/:userId", users.getById); // Get one user by it's id

// Update
router.put(
  "/:userId",
  upload.single("image"),
  validateUserUpdate,
  isValidated,
  users.update
); // Update a specific user by it's id

// Delete
router.delete("/:userId", users.delete); // delete a specific user by it's id

// Add service Provider to favorite
router.put("/:userId/:serviceProviderId", users.addToFavorite);
router.get("/:userId/favorites", users.getFavorites);

// Export
module.exports = router;
