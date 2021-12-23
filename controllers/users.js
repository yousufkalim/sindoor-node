/**
 * User CRUD controllers
 * @author Yousuf Kalim
 */
const Users = require("../models/Users");
const Providers = require("../models/service_providers");
const bcrypt = require("bcryptjs");
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password, confirmPassword, role } = req.body; // Getting required fields from body
    const existingProvider = await Providers.findOne({ email });
    const existingUser = await Users.findOne({ email }); // Finding already existing user

    // Extra Validations
    if (existingUser || existingProvider) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    } else if (password !== confirmPassword) {
      // Passwords not same
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password are not same.",
      });
    }

    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }

    // Creating User
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    if (role == "ServiceProvider") {
      const user = await Providers.create(req.body); // Adding user in db
      // Done
      res.status(202).json({ success: true, user }); //Success
    } else {
      const user = await Users.create(req.body); // Adding user in db
      // Done
      res.status(202).json({ success: true, user }); //Success
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all users
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    if (req.params.role == "ServiceProvider") {
      const users = await Providers.find();
      res.status(200).json({ success: true, users }); // Success
    } else {
    const users = await Users.find({role:req.params.role}); // Finding all the users from db
      res.status(200).json({ success: true, users }); // Success
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const role = req.params.role;
    if (role == "ServiceProvider") {
      const user = await Providers.findById(userId); // Finding user by id
      if (user) res.status(202).json({ success: true, user });
      // Success
      else res.status(404).json({ success: false, message: "Invalid UserID" });
    } else {
      const user = await Users.findById(userId); // Finding user by id
      if (user) res.status(202).json({ success: true, user });
      // Success
      else res.status(404).json({ success: false, message: "Invalid User" });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const role = req.params.role;
    if (req.body.role == "ServiceProvider") {
      const user = await Providers.findByIdAndUpdate(userId, req.body, {
        new: true,
      }); // Updating the user
      if (user) res.status(202).json({ success: true, user });
      // Success
      else res.status(404).json({ success: false, message: "Invalid User" });
    } else {
      const user = await Users.findByIdAndUpdate(userId, req.body, {
        new: true,
      }); // Updating the user
      if (user) res.status(202).json({ success: true, user });
      // Success
      else res.status(404).json({ success: false, message: "Invalid User" });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const role = req.params.role;
    if (role == "ServiceProvider") {
      const user = await Providers.findByIdAndDelete(userId); // Deleting the user
      if (user) res.status(202).json({ success: true, user });
      // Success
      else res.status(404).json({ success: false, message: "Invalid User" });
    } else {
      const user = await Users.findByIdAndDelete(userId); // Deleting the user
      if (user) res.status(202).json({ success: true, user });
      // Success
      else res.status(404).json({ success: false, message: "Invalid User" });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
