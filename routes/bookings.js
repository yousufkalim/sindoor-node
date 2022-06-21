/**
 * Booking CRUD routes
 * @author Najam Ul Saqib
 */
const express = require("express");
const router = express.Router();
const bookings = require("../controllers/bookings");
const {
  validateRequestAccept,
  isValidated,
} = require("../middleware/validators");

router.post("/request", bookings.SendRequest); // send Request for booking

router.get("/:bookingId", bookings.getById); // get Booking by Id

router.get("/user/:userId/requests", bookings.getRequests); // get Requests by service provider id
router.get("/user/:userId/few", bookings.getFewBookings); // get Requests by service provider id
router.get("/user/:userId", bookings.getBookings); // get Requests by service provider id

router.get("/event/:eventId", bookings.getRequestsByEventId); // get Requests by event id

router.put(
  "/:requestId",
  validateRequestAccept,
  isValidated,
  bookings.acceptRequest
); // accept booking

router.put("/stripe/checkout", bookings.checkOut);

router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  bookings.webhook
);

router.put("/reject/:requestId", bookings.rejectRequest); // reject booking

router.get("/can-rate/:userId/:serviceProviderId", bookings.canRateInfo); // to check weather user can rate or not.

// Export
module.exports = router;
