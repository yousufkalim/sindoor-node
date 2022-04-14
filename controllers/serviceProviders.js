/**
 * Service provider CRUD controllers
 * @author Najam Ul Saqib
 */
const Users = require("../models/Users");
const ServiceProviders = require("../models/ServiceProviders");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendOTP");
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password, phone } = req.body; // Getting required fields from body
    const existingServiceProvider = await ServiceProviders.findOne({ email }); // Finding already existing Service Provider
    const existingUser = await Users.findOne({ email }); // Finding already existing user

    // Extra Validations
    if (existingUser || existingServiceProvider) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }

    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }
    // Creating User
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8

    let otp = Math.random().toFixed(4).slice(-4);
    req.body.otp = otp;
    req.body.location = JSON.parse(req.body.location);
    req.body.culture = JSON.parse(req.body.culture);

    // Adding user in db
    await ServiceProviders.create(req.body).then((user) => {
      //! uncomment send otp
      //TODO: Change Phone number format to french before production.
      // Sending otp to user
      // sendOTP(phone, otp)
      //   .then(() => {
      res.json({
        success: true,
        message: "Account created and otp sent",
        user,
      }); //Success
      // })
      // .catch((err) => {
      //   throw err;
      // });
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get User
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    let serviceProviders = await ServiceProviders.find();
    res.json({ success: true, users: serviceProviders });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Get User By id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    let { userId } = req.params;
    let serviceProvider = await ServiceProviders.findById(userId);
    res.json({ success: true, user: serviceProvider });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete User
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await ServiceProviders.findByIdAndDelete(userId);
    res.json({ success: true, user });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update User
 * @param {object} req
 * @param {object} res
 */

exports.update = async (req, res) => {
  try {
    const { userId } = req.params;
    req.body.location = JSON.parse(req.body.location);

    // Cannot update with this API
    if (req.body.password) {
      req.body.password = undefined;
    }

    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }

    const user = await ServiceProviders.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // Updating the user
    res.json({ success: true, message: "User updated successfully", user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
