/**
 * All the validation
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const { check, validationResult } = require("express-validator");

/*
 ====================
 Validations
 ====================
 */

// You can create multiple validations strategies (Read express-validator documentation for more details)
// User Signup Validation
exports.validateUser = [
  check("first_name", "First name is required.").notEmpty().trim(),
  check("last_name", "Last name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("fcmToken", "FCM Token is required").notEmpty().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirmPassword", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("phone", "Phone number is required.").notEmpty().isNumeric().trim(),
  check("role", "Role is not correct").isIn([
    "Organizer",
    "Co-Organizer",
    "Guest",
    "ServiceProvider",
  ]),
];
exports.validateRole = [
  check("role", "Role is not correct Organizer/Co-Organizer/Guest/ServiceProvider").isIn([
    "Organizer",
    "Co-Organizer",
    "Guest",
    "ServiceProvider",
  ]),
];
// Login validation
exports.validateLogin = [
  check("email", "Email is required").notEmpty().isEmail().trim().toLowerCase(),
  check("fcmToken", "FCM Token is required").notEmpty().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("role", "Role is not correct").isIn([
    "Organizer",
    "Co-Organizer",
    "Guest",
    "ServiceProvider",
  ]),
];

// Change password validation
exports.changePasswordValidate = [
  check("oldPassword", "Old Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("newPassword", "New password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirmPassword", "Confirm password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("role", "Role is not correct").isIn([
    "Organizer",
    "Co-Organizer",
    "Guest",
    "ServiceProvider",
  ]),
];
//Adding services Validation
exports.validateService = [
  check("title", "title is required.").notEmpty().trim(),
  check("price", "price is required.").notEmpty().isNumeric().trim(),
  check("phone", "Phone number is required.").notEmpty().isNumeric().trim(),
  check("category", "category is required.").notEmpty().trim(),
  check("service_provider", "service provider Id is required.")
    .notEmpty()
    .trim(),
  check("service_for", "service_for is not correct.").isIn([
    "Per Day",
    "Per Hour",
  ]),
];
//Validation for User's Latitude longitude inorder to find nearby services
exports.validateCoordinates = [
  check("latitude", "Latitude is required.").notEmpty().isNumeric().trim(),
  check("longitude", "Longitude is required.").notEmpty().isNumeric().trim(),
];
//Adding category Validation
exports.validateCategory = [
  check("category", "category is required ").notEmpty().trim(),
];

//Request a new Service
exports.validateRequest = [
  check("service", "ServiceId is required ").notEmpty().trim(),
  check("client", "ClientId is required ").notEmpty().trim(),
  check("service_provider", "service_provider Id is required ")
    .notEmpty()
    .trim(),
];
//Validation for Status to get request accordingly
exports.validategetRequest = [
  check("status", "status is required ").notEmpty().trim(),
  check("status", "status is not correct.").isIn([
    "Pending",
    "Accepted",
    "Cancel",
  ]),
  check("userID", "userID is required ").notEmpty().trim(),
];
//Update status of sent request
exports.validaterequestStatus = [
  check("status", "status is required ").notEmpty().trim(),
  check("status", "status is not correct.").isIn(["Accepted", "Cancel"]),
  check("client", "clientId is required ").notEmpty().trim(),
  check("service_provider", "service_provider Id is required ")
    .notEmpty()
    .trim(),
  check("id", "requestId is required").notEmpty().trim(),
];
//Validation for chat initialization
exports.validateChat = [
  check("Organizer", "OrganizerID is required").notEmpty().trim(),
  check("Service_provider", "ServiceProvider ID is required").notEmpty().trim(),
];
//Validation for chatID
exports.validateChatID = [
  check("chatID", "chatID is required").notEmpty().trim(),
];
//validation for finding all chats of a user
exports.validateUserID = [
  check("userID", "userID is required").notEmpty().trim(),
];
/*
 ======================
 Result
 ======================
 */

/**
 * To check if request validated successfully or not, according to our validation strategies
 * @param {object} req
 * @param {object} res
 * @param {*} next
 */
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req); // Validating the request by previous middleware's strategy
  if (!errors.isEmpty()) {
    // On error
    res.status(400).send({ success: false, message: errors.array()[0] }); // Sending first error to the client from array of errors
  } else {
    // Validated successfully
    next(); // Pass the request to next middleware or controller
  }
};
