/**
 ** Service provider CRUD routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const serviceProviders = require("../controllers/serviceProviders");
const { upload } = require("../middleware/multer");
const {
  validateUser,
  validateServiceProvider,
  isValidated,
} = require("../middleware/validators");

/**
 ** Service provider Routes
 * @method post Service provider signup
 * @method get get all Service providers
 * @method get get Service provider by id
 * @method put update Service provider
 * @method delete delete Service provider
 */

// Create - User Signup
router.post(
  "/",
  upload.single("image"),
  validateServiceProvider,
  isValidated,
  serviceProviders.create
);

// Read
router.get("/", serviceProviders.getAll); // Get all users at once
router.get("/:userId", serviceProviders.getById); // Get one user by it's id

// Update
router.put(
  "/:userId",
  upload.single("image"),
  //   validateServiceProviderUpdate,
  //   isValidated,
  serviceProviders.update
); // Update a specific user by it's id

// Delete
router.delete("/:userId", serviceProviders.delete); // delete a specific user by it's id

// Export
module.exports = router;
