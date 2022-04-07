/**
 * Event CRUD routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const events = require("../controllers/events");
const { upload } = require("../middleware/multer");
const {
  validateStatus,
  createEventValidate,

  isValidated,
} = require("../middleware/validators");
const { checkAuth } = require("../middleware/checkAuth");

/**
 ** Routes
 * @method post create event
 * @method get get all users
 * @method get get user by id
 * @method put update user
 * @method delete delete user
 */

//* Get all events of current user
router.post(
  "/",
  checkAuth,
  upload.array("photos"),
  createEventValidate,
  isValidated,
  events.create
);

// Join event via code
router.put("/join", checkAuth, events.joinEvent);

// change guest role
router.put("/role/:eventId/:userId", events.changeRole);

// update guest status
router.put(
  "/status/:eventId/:userId",
  validateStatus,
  isValidated,
  events.updateGuestStatus
);

// Update Event
router.put("/:eventId", upload.array("photos"), checkAuth, events.updateEvent);

// Get All events as guest / organizer
router.get("/", checkAuth, events.getEvents);

module.exports = router;
