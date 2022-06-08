/**
 * Booking CRUD routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const bookings = require("../controllers/bookings");
const {
  validateRequestAccept,
  isValidated,
} = require("../middleware/validators");

router.post("/request", bookings.SendRequest); // send Request for booking

router.get("/:userId", bookings.getRequests); // get Requests by service provider id

router.get("/event/:eventId", bookings.getRequestsByEventId); // get Requests by event id

router.put(
  "/:requestId",
  validateRequestAccept,
  isValidated,
  bookings.acceptRequest
); // accept booking

router.put("/reject/:requestId", bookings.rejectRequest); // reject booking

// Export
module.exports = router;
