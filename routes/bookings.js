/**
 * Services CRUD routes
 * @author Yousuf Kalim
 *  @codeby Shuja Naqvi
 */
const router = require("express").Router();
const bookings = require("../controllers/bookings");
const {
  validateRequest,
  validaterequestStatus,
  validateRole,
  validategetRequest,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Create request a service
 * @method put update  Service request
 * @method get view all requested services
 */
// Create - New Request
router.post("/", validateRequest, isValidated, bookings.create);
//get all requests of a user
router.get(
  "/allbookings/:role/:userID",
  validateRole,
  isValidated,
  bookings.getAll
),
  //get requests of according to status
  router.get(
    "/:userID/:status/:role",
    validategetRequest,
    validateRole,
    isValidated,
    bookings.getBystatus
  ),
  //Request Response->It will tell the client whether request accpted or not
  router.put(
    "/bookingresponse",
    validaterequestStatus,
    isValidated,
    bookings.requestResponse
  ),
  // Export
  (module.exports = router);
