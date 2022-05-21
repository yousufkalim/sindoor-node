/**
 * User CRUD controllers
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
    const existingUser = await Users.findOne({ email }); // Finding already existing user
    const existingServiceProvider = await ServiceProviders.findOne({ email }); // Finding already existing user

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

    // Adding user in db
    await Users.create(req.body).then((user) => {
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
 * Get all users
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Users.find(); // Finding all the users from db
    res.json({ success: true, users }); // Success
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
    const user = await Users.findById(userId); // Finding user by id
    res.json({ success: true, user }); // Success
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
    const { userId } = req.params; // Getting user id from URL parameter

    // Cannot update with this API
    if (req.body.password) {
      req.body.password = undefined;
    }

    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }

    const user = await Users.findByIdAndUpdate(userId, req.body, { new: true }); // Updating the user
    res.json({ success: true, message: "User updated successfully", user }); // Success
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
    const { userId } = req.params; // Getting user id from URL parameter
    const user = await Users.findByIdAndDelete(userId); // Deleting the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add a service provider to favorite
exports.addToFavorite = async (req, res) => {
  try {
    let { userId, serviceProviderId } = req.params;
    let user = await Users.findById(userId);
    if (user.favorites.includes(serviceProviderId)) {
      let index = user.favorites.indexOf(serviceProviderId);
      if (index > -1) {
        user.favorites.splice(index, 1);
        user.save();
        return res.json({
          success: true,
          favorites: user.favorites,
          message: "Service provider removed from favorite",
        });
      }
    } else {
      user.favorites.push(serviceProviderId);
      user.save();
      return res.json({
        success: true,
        favorites: user.favorites,
        message: "Service provider added to favorite",
      });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get favorite vendors
exports.getFavorites = async (req, res) => {
  try {
    let { userId } = req.params;
    let user = await Users.findById(userId);

    let favorites = await ServiceProviders.find({
      _id: { $in: user.favorites },
    });

    // .aggregate([
    //   {
    //     $match: {
    //       _id: {
    //         $in: ["6268f59e63f6491dad84319c", "6268e01383127e0e537ae334"],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       company_name: 1,
    //       photo: 1,
    //     },
    //   },
    // ]);
    res.json({ success: true, favorites });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
