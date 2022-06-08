/**
 * All the validation
 * @author Yousuf Kalim
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
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength({ max: 10, min: 10 })
    .withMessage("Invalid phone number format")
    .isNumeric()
    .withMessage("Phone number can only be numeric")
    .trim(),
  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be minimum 8 characters"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Password is required.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be minimum 8 characters"),
  check("role", "Invalid role")
    .optional()
    .trim()
    .isIn(["Organizer", "Co-Organizer", "Guest", "ServiceProvider"]),
];

// User Signup Validation
exports.validateUserUpdate = [
  check("email").optional().isEmail().withMessage("Invalid Email.").trim(),
  check("phone")
    .optional()
    .isLength({ max: 10, min: 10 })
    .withMessage("Invalid phone number format")
    .isNumeric()
    .withMessage("Phone number can only be numeric")
    .trim(),
  check("role")
    .optional()
    .trim()
    .isIn(["Organizer", "Co-Organizer", "Guest", "ServiceProvider"])
    .withMessage("Invalid role"),
  check("gender")
    .optional()
    .trim()
    .isIn(["male", "female", "others"])
    .withMessage("Invalid gender"),
];

// Login validation
exports.validateLogin = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address")
    .trim()
    .toLowerCase(),
  check("password", "Password is required.").notEmpty(),
];

// Timeline Validation
exports.validateTimeLine = [
  check("title").notEmpty().withMessage("Title is required.").trim(),
  check("description").notEmpty().withMessage("Description is required").trim(),
  check("start_time").notEmpty().withMessage("Start Time is required"),
  check("start_date").notEmpty().withMessage("Start Date is required"),
  check("end_time").notEmpty().withMessage("End Time is required"),
  check("end_date").notEmpty().withMessage("End Date is required"),
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
];

// Create event validation
exports.createEventValidate = [
  check("name", "Name is required").notEmpty().trim(),
  check("type", "Type is required").notEmpty().trim(),
  check("description", "Description is required").notEmpty().trim(),
];
// Payment validation
exports.validatePayment = [
  check("amount")
    .notEmpty()
    .withMessage("Payment amount is required.")
    .isNumeric()
    .withMessage("Payment must be numeric.")
    .isFloat({ min: 0 })
    .withMessage("Payment cannot be negative"),
];

// Create event validation
exports.validateWishlist = [
  check("eventId", "Event ID is required").notEmpty(),
  check("name", "Name is required").notEmpty().trim(),
  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price can only be numeric")
    .trim(),
  check("description", "Description is required").notEmpty().trim(),
];

exports.validateJoinEvent = [
  check("code", "Event Code is required").notEmpty().trim(),
];

exports.validateServiceProvider = [
  check("company_name").notEmpty().withMessage("Company name is required."),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid Email address"),
  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Invalid phone number format")
    .isNumeric()
    .withMessage("Phone number can only be numeric"),
  check("description").notEmpty().withMessage("Description is required."),
  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be minimum 8 characters"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Password is required.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be minimum 8 characters"),

  check("location").notEmpty().withMessage("Location is required."),
  check("culture").notEmpty().withMessage("Culture is required."),
];

exports.validateService = [
  check("category").notEmpty().withMessage("Category of service is required."),
  check("name").notEmpty().withMessage("Name of service is required."),
  check("price").notEmpty().withMessage("Price of service is required."),
  check("deposit").notEmpty().withMessage("Deposit of service is required."),
  check("fixed_amount")
    .notEmpty()
    .withMessage("Fixed Amount of service is required."),
  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Invalid phone number format")
    .isNumeric()
    .withMessage("Phone number can only be numeric"),
  check("location").notEmpty().withMessage("Location of service is required."),
  check("description")
    .notEmpty()
    .withMessage("Description of service is required."),
];

exports.validateRequestAccept = [
  check("final_price")
    .notEmpty()
    .withMessage("Total price is required")
    .isNumeric()
    .withMessage("Amount can only be numeric"),
  check("deposit_price")
    .notEmpty()
    .withMessage("Deposit amount is required")
    .isNumeric()
    .withMessage("Amount can only be numeric"),
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
    res.status(400).send({ success: false, message: errors.array()[0].msg }); // Sending first error to the client from array of errors
  } else {
    // Validated successfully
    next(); // Pass the request to next middleware or controller
  }
};
