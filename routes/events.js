/**
 * Event CRUD routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const events = require("../controllers/events");
const { upload } = require("../middleware/multer");
const {
  validateTimeLine,
  createEventValidate,
  validateJoinEvent,
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

// Create event.
router.post(
  "/",
  checkAuth,
  upload.array("photos"),
  createEventValidate,
  isValidated,
  events.create
);

// Join event via code
router.put(
  "/join",
  checkAuth,
  validateJoinEvent,
  isValidated,
  events.joinEvent
);

// change guest role
router.put("/role/:eventId/:userId", events.changeRole);

// Remove guest from event
router.put("/removeGuest/:eventId/:userId", events.removeGuest);

// update guest status
router.put("/status/:eventId/:userId", events.updateGuestStatus);

// Update Event
router.put("/:eventId", upload.array("photos"), checkAuth, events.updateEvent);

// Crete event timeline
router.post(
  "/:eventId/timeline",
  validateTimeLine,
  isValidated,
  events.createTimeline
);

// Get Upcoming events
router.get("/", checkAuth, events.getUpcomingEvents);

// Get Past events
router.get("/past", checkAuth, events.getPastEvents);

module.exports = router;
