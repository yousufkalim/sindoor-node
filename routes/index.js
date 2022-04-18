/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require("express").Router();
const moment = require("moment");

// Parent Routes
// router.use("/admins", require("./admins")); // All the user routes
router.use("/users", require("./users")); // All the user routes
router.use("/serviceProviders", require("./serviceProviders")); // All the user routes
router.use("/auth", require("./auth")); // All the auth routes
router.use("/events", require("./events")); // All the event routes

// Export
module.exports = router;
