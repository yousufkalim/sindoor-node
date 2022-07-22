/**
 * User CRUD controllers
 * @author Najam Ul Saqib
 */
const Users = require("../models/Users");
const ServiceProviders = require("../models/ServiceProviders");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendOTP");
const { translate } = require("../utils/translate");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password, confirmPassword, phone } = req.body; // Getting required fields from body
    const existingUser = await Users.findOne({ email }); // Finding already existing user
    const existingServiceProvider = await ServiceProviders.findOne({ email }); // Finding already existing user

    // Extra Validations
    if (existingUser || existingServiceProvider) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: translate["User already exists."] });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({
        success: false,
        message: translate["Password and Confirm password should be same."],
      });
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
        message: translate["Account created and otp sent"],
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
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
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
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};
/**
 * Get all users by admin
 * @param {object} req
 * @param {object} res
 */
exports.getByAdmin = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.body;
    const users = await Users.find()
      .skip(pageNumber * pageSize)
      .limit(parseInt(pageSize))
      .sort({ date: -1 }); // Finding all the users from db
    const totalResults = await Users.find().countDocuments();
    res.json({ success: true, users, totalResults }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
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
    let user = await Users.findById(userId); // Finding user by id
    if (!user) {
      user = await ServiceProviders.findById(userId);
    }
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
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
    res.json({
      success: true,
      message: translate["User updated successfully"],
      user,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
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
    const { password, isSocial } = req.body;

    let user = await Users.findOne({
      _id: userId,
      deleted: false,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: translate["User not found"] });
    }
    if (isSocial) {
      user = await Users.findByIdAndUpdate(
        userId,
        {
          deleted: true,
          facebook: user?.facebook && `deleted-${user?.facebook}`,
          google: user?.google && `deleted-${user?.google}`,
        },
        {
          new: true,
        }
      );
    } else {
      console.log(req.body, "pass");
      console.log(user.password, "user");
      const isMatched = bcrypt.compareSync(password, user.password);
      if (!isMatched) {
        // If password not matched
        return res
          .status(400)
          .json({ success: false, message: translate["Invalid Password"] });
      }
      user = await Users.findByIdAndUpdate(
        userId,
        {
          deleted: true,
          email: `deleted-${user.email}`,
        },
        {
          new: true,
        }
      );
    }

    res.json({ success: true, message: translate["Account Deleted."] }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
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
          message: translate["Service provider removed from favorite"],
        });
      }
    } else {
      user.favorites.push(serviceProviderId);
      user.save();
      return res.json({
        success: true,
        favorites: user.favorites,
        message: translate["Service provider added to favorite"],
      });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
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

    res.json({ success: true, favorites });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

//* CREATING INDIVIDUAL STRIPE CONNECTED ACCOUNT
exports.addBank = async (req, res) => {
  try {
    let { userId } = req.params;
    let { phone, DOB, bankName, iban } = req.body;
    DOB = JSON.parse(DOB);
    const accountToken = req.body.token;

    let front =
      req.files["front"] !== undefined ? req.files["front"][0].path : "";
    front !== "" && (front = front.replace(/\\/g, "/"));

    let back = req.files["back"] !== undefined ? req.files["back"][0].path : "";
    back !== "" && (back = back.replace(/\\/g, "/"));

    let user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: translate["No user Found"] });
    }

    // creating company account
    const account = await stripe.account.create({
      type: "custom",
      country: "FR",
      account_token: accountToken,
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: user.first_name,
        mcc: "5441",
        url: "https://www.google.com",
      },
      external_account: {
        object: "bank_account",
        account_number: iban,
        bank_name: bankName,
        country: "FR",
        currency: "eur",
      },
    });

    user.bank.phone = phone;
    user.bank.DOB = DOB;
    user.bank.bankName = bankName;
    user.bank.iban = iban;
    user.bank.stripeID = account.id;
    user.bank.front = front;
    user.bank.back = back;

    user.save();

    res
      .status(200)
      .send({ success: true, message: translate["Bank Account added"] });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

exports.EditBank = async (req, res) => {
  try {
    let { userId } = req.params;

    let user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: translate["No user Found"] });
    }

    const accountLink = await stripe.accountLinks.create({
      account: user.bank.stripeID,
      refresh_url: `${process.env.CLIENT_URL}/redirect=true`,
      return_url: `${process.env.CLIENT_URL}/redirect=true`,
      type: "account_update",
    });
    res.status(200).json({ success: true, url: accountLink });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

exports.checkBalance = async (req, res) => {
  try {
    let { accountId } = req.params;
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });

    res.json({ success: true, balance });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};
