/**
 * All the validation
 * @author Yousuf Kalim
 */
const { check, validationResult } = require("express-validator");
const { translate } = require("../utils/translate");

/*
====================
Validations
====================
*/

// You can create multiple validations strategies (Read express-validator documentation for more details)
// User Signup Validation
exports.validateUser = [
  check("first_name", translate["First name is required."]).notEmpty().trim(),
  check("last_name", translate["Last name is required."]).notEmpty().trim(),
  check("email")
    .notEmpty()
    .withMessage(translate["Email is required."])
    .trim()
    .isEmail()
    .withMessage(translate["Invalid Email."]),
  check("phone")
    .notEmpty()
    .withMessage(translate["Phone number is required."])
    .isLength({ max: 10, min: 10 })
    .withMessage(translate["Invalid phone number format"])
    .isNumeric()
    .withMessage(translate["Phone number can only be numeric"])
    .trim(),
  check("password")
    .notEmpty()
    .withMessage(translate["Password is required."])
    .trim()
    .isLength({ min: 8 })
    .withMessage(translate["Password must be minimum 8 characters"]),
  check("confirmPassword")
    .notEmpty()
    .withMessage(translate["Confirm Password is required."])
    .trim()
    .isLength({ min: 8 })
    .withMessage(translate["Password and Confirm password should be same."]),
  check("role", translate["Invalid role"])
    .optional()
    .trim()
    .isIn(["Organizer", "Co-Organizer", "Guest", "ServiceProvider"]),
];

// User Signup Validation
exports.validateUserUpdate = [
  check("email")
    .optional()
    .isEmail()
    .withMessage(translate["Invalid Email."])
    .trim(),
  check("phone")
    .optional()
    .isLength({ max: 10, min: 10 })
    .withMessage(translate["Invalid phone number format"])
    .isNumeric()
    .withMessage(translate["Phone number can only be numeric"])
    .trim(),
  check("role")
    .optional()
    .trim()
    .isIn(["Organizer", "Co-Organizer", "Guest", "ServiceProvider"])
    .withMessage(translate["Invalid role"]),
  check("gender")
    .optional()
    .trim()
    .isIn(["male", "female", "others"])
    .withMessage(translate["Invalid gender"]),
];

// Login validation
exports.validateLogin = [
  check("email")
    .notEmpty()
    .withMessage(translate["Email is required."])
    .isEmail()
    .withMessage(translate["Invalid Email."])
    .trim()
    .toLowerCase(),
  check("password", translate["Password is required."]).notEmpty(),
];

// Timeline Validation
exports.validateTimeLine = [
  check("title").notEmpty().withMessage(translate["Title is required."]).trim(),
  check("description")
    .notEmpty()
    .withMessage(translate["Description is required"])
    .trim(),
  check("start_time")
    .notEmpty()
    .withMessage(translate["Start Time is required"]),
  check("start_date")
    .notEmpty()
    .withMessage(translate["Start Date is required"]),
  check("end_time").notEmpty().withMessage(translate["End Time is required"]),
  check("end_date").notEmpty().withMessage(translate["End Date is required"]),
];

// Change password validation
exports.changePasswordValidate = [
  check("oldPassword", translate["Old Password is required."])
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("newPassword", translate["New password is required."])
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirmPassword", translate["Confirm password is required."])
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];

// Create event validation
exports.createEventValidate = [
  check("name", translate["Name is required"]).notEmpty().trim(),
  check("type", translate["Type is required"]).notEmpty().trim(),
  check("description", translate["Description is required"]).notEmpty().trim(),
];
// Payment validation
exports.validatePayment = [
  check("amount")
    .notEmpty()
    .withMessage(translate["Payment amount is required."])
    .isNumeric()
    .withMessage(translate["Payment must be numeric."])
    .isFloat({ min: 0 })
    .withMessage(translate["Payment cannot be negative"]),
];

exports.validateSendEmail = [
  check("name", translate["Name is required"]).notEmpty().trim(),
  check("email")
    .trim()
    .notEmpty()
    .withMessage(translate["Email is required."])
    .isEmail()
    .withMessage(translate["Invalid Email."]),
  check("message", translate["Message is required"]).notEmpty().trim(),
];

// Create event validation
exports.validateWishlist = [
  check("eventId", translate["Event ID is required"]).notEmpty(),
  check("name", translate["Name is required"]).notEmpty().trim(),
  check("price")
    .notEmpty()
    .withMessage(translate["Price is required"])
    .isNumeric()
    .withMessage(translate["Price can only be numeric"])
    .trim(),
  check("description", translate["Description is required"]).notEmpty().trim(),
];

exports.validateJoinEvent = [
  check("code", translate["Event Code is required"]).notEmpty().trim(),
];

exports.validateServiceProvider = [
  check("company_name")
    .notEmpty()
    .withMessage(translate["Company name is required."]),
  check("email")
    .trim()
    .notEmpty()
    .withMessage(translate["Email is required."])
    .isEmail()
    .withMessage(translate["Invalid Email."]),
  check("phone")
    .trim()
    .notEmpty()
    .withMessage(translate["Phone number is required."])
    .isLength({ min: 10, max: 10 })
    .withMessage(translate["Invalid phone number format"])
    .isNumeric()
    .withMessage(translate["Phone number can only be numeric"]),
  check("description")
    .notEmpty()
    .withMessage(translate["Description is required"]),
  check("password")
    .notEmpty()
    .withMessage(translate["Password is required."])
    .trim()
    .isLength({ min: 8 })
    .withMessage(translate["Password must be minimum 8 characters"]),
  check("confirmPassword")
    .notEmpty()
    .withMessage(translate["Confirm Password is required."])
    .trim()
    .isLength({ min: 8 })
    .withMessage(translate["Password and Confirm password should be same."]),

  check("location").notEmpty().withMessage(translate["Location is required."]),
  check("culture").notEmpty().withMessage(translate["Culture is required."]),
];

exports.validateService = [
  check("category")
    .notEmpty()
    .withMessage(translate["Category of service is required."]),
  check("name")
    .notEmpty()
    .withMessage(translate["Name of service is required."]),
  check("price")
    .notEmpty()
    .withMessage(translate["Price of service is required."]),
  check("deposit")
    .notEmpty()
    .withMessage(translate["Deposit of service is required."]),
  check("fixed_amount")
    .notEmpty()
    .withMessage(translate["Fixed Amount of service is required."]),
  check("phone")
    .trim()
    .notEmpty()
    .withMessage(translate["Phone number is required."])
    .isLength({ min: 10, max: 10 })
    .withMessage(translate["Invalid phone number format"])
    .isNumeric()
    .withMessage(translate["Phone number can only be numeric"]),
  check("location")
    .notEmpty()
    .withMessage(translate["Location of service is required."]),
  check("description")
    .notEmpty()
    .withMessage(translate["Description of service is required."]),
];

exports.validateRequestAccept = [
  check("final_price")
    .notEmpty()
    .withMessage(translate["Final price is required"])
    .isNumeric()
    .withMessage(translate["Amount can only be numeric"]),
  check("deposit_price")
    .notEmpty()
    .withMessage(translate["Deposit amount is required"])
    .isNumeric()
    .withMessage(translate["Amount can only be numeric"]),
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
