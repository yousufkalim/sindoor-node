/**
 * Event CRUD routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const events = require("../controllers/events");
const { upload } = require("../middleware/multer");
const {
  validateWishlist,
  validateTimeLine,
  createEventValidate,
  validateJoinEvent,
  validatePayment,
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

// Get wishlists of event
router.get("/:eventId/wishlists", events.wishlists);

// Create wishlists of event
router.post(
  "/wishlists",
  upload.single("image"),
  validateWishlist,
  isValidated,
  events.CreateWishlists
);

// Delete wishlist Item
router.delete("/wishlists/:itemId", events.deleteWishlistItem);

// pay amount
router.post(
  "/wishlists/:itemId",
  checkAuth,
  validatePayment,
  isValidated,
  events.payAmount
);

// upload pictures
router.post(
  "/pictures/:eventId",
  upload.array("pictures"),
  events.uploadPictures
);

// get not approved pictures
router.get("/pictures/:eventId", events.getPicturesNeedApproval);

// change image status
router.put("/pictures/:pictureId/status", events.changePictureStatus);

// get pictures approved
router.get("/pictures/:eventId/approved", events.getApprovedPictures);

// get favorite pictures
router.get("/pictures/:eventId/:userId", events.getLikedPictures);

// Like picture
router.patch("/pictures/:pictureId/:userId", events.likePicture);

// Get Upcoming events
router.get("/", checkAuth, events.getUpcomingEvents);

// Get Past events
router.get("/past", checkAuth, events.getPastEvents);

// Get event by id
router.get("/:eventId", events.getEventByID);

module.exports = router;
