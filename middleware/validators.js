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
    .isLength(10)
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
    .isLength(10)
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

// Status Validation
exports.validateStatus = [
  check("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["pending", "accepted", "refused"])
    .withMessage("Invalid status."),
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
  check("start_date", "Date is required").notEmpty().trim(),
  check("start_time", "Start Time is required").notEmpty().trim(),
  check("description", "Description is required").notEmpty().trim(),
];

exports.validateJoinEvent = [
  check("code", "Event Code is required").notEmpty().trim(),
];

exports.validateServiceProvider = [
  check("company_name").notEmpty().withMessage("Company name is required."),
  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid Email address")
    .trim(),
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength(10)
    .withMessage("Invalid phone number format")
    .isNumeric()
    .withMessage("Phone number can only be numeric")
    .trim(),
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
