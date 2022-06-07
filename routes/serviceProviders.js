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
const { checkAdminAuth } = require("../middleware/adminAuth");

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
router.get("/", serviceProviders.getFew); // Get Few users at once
router.post("/getByAdmin", checkAdminAuth, serviceProviders.getByAdmin); // GetByAdmin
router.get("/map", serviceProviders.getUsersForMap); // get users for map
router.get("/:userId", serviceProviders.getById); // Get one user by it's id

// Update
router.put(
  "/:userId",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 5,
    },
  ]),
  //   validateServiceProviderUpdate,
  //   isValidated,
  serviceProviders.update
); // Update a specific user by it's id

router.post("/rating/:userId", serviceProviders.rateUser); // rate User

// Delete
router.delete("/:userId", serviceProviders.delete); // delete a specific user by it's id
// Export
module.exports = router;
