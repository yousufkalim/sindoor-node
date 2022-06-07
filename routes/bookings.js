/**
 * Booking CRUD routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const bookings = require("../controllers/bookings");

router.post("/request", bookings.SendRequest); // send Request for booking

// Export
module.exports = router;
