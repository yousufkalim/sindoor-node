/**
 * All api routes handles here
 * @author Yousuf Kalim
 * @codeBy Shuja Naqvi
 */
const router = require("express").Router();

// Parent Routes
router.use("/users", require("./users")); // All the user routes
router.use("/auth", require("./auth")); // All the auth routes
router.use("/services", require("./services")); // All the services routes
router.use("/categories", require("./categories")); // All the categories routes
router.use("/bookings", require("./bookings")); // All the categories routes
router.use("/chats", require("./chats")); // All the chat routes
// router.use("/events", require("./events")); // All the event routes
// router.use("/guests", require("./guests")); // All the chat routes
// router.use("/invoices", require("./invoices")); // All the invoices routes
// router.use("/albums", require("./albums")); // All the albums routes
//router.use("/serviceproviders", require("./service_providers")); // All the serviceproviders routes
// Export
module.exports = router;
