/**
 * User auth controllers
 * @author Yousuf Kalim
 */
const Users = require("../models/Users");
const ServiceProviders = require("../models/ServiceProviders");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const { sendOTP } = require("../utils/sendOTP");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;

/**
 * Login
 * @param {object} req
 * @param {object} res
 */
exports.login = async (req, res) => {
  try {
    // Getting email and password
    const { email, password, fcmToken } = req.body;
    let role = "User";
    // Getting user from db
    let user = await Users.findOneAndUpdate(
      { email },
      { fcmToken },
      { new: true }
    );

    if (!user) {
      // If user not found check from service providers
      role = "ServiceProvider";
      user = await ServiceProviders.findOneAndUpdate(
        { email },
        { fcmToken },
        { new: true }
      ); // find user from service provider.
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }

    // Comparing password
    const isMatched = bcrypt.compareSync(password, user.password);

    if (!isMatched) {
      // If password not matched
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    // Creating payload with user object
    const payload = { user };

    // Generating token
    jwt.sign(payload, tokenSecret, { expiresIn: "30d" }, (err, token) => {
      if (err) throw err;

      // done
      res.json({ success: true, user, token, role });
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Change Password
 * @param {object} req
 * @param {object} res
 */
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are not same",
      });
    }

    let user = await Users.findById(userId);

    if (!user) {
      user = await ServiceProviders.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }

    const isMatched = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old Password" });
    }

    // Generate token
    user.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));

    await user.save();

    res.json({ success: true, user, message: "Password changed." });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
exports.forgot = async (req, res) => {
  try {
    let { email } = req.params;
    let user = await Users.findOne({ email });

    if (!user) {
      user = await ServiceProviders.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }

    // Generating random password
    let randomPassword = Math.random().toString(36).slice(-8);

    // Sending email to user
    sendEmail(email, randomPassword)
      .then(async () => {
        // If email is sent then we have to update the password in db
        user.password = await bcrypt.hash(randomPassword, parseInt(bcryptSalt));
        await user.save();

        // Done
        res.json({ success: true, message: "Email sent successfully" });
      })
      .catch((err) => {
        // Error handling
        console.log("Error ----> ", err);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Confirm auth
 * @param {object} req
 * @param {object} res
 */
exports.confirmAuth = async (req, res) => {
  // If user authenticated
  res.json({ success: true, user: req.user });
};

/**
 ** Verify OTP
 * @param {object} req
 * @param {object} res
 */
exports.verifyOTP = async (req, res) => {
  try {
    let { userId } = req.params;
    let { otp } = req.body;

    let user = await Users.findById(userId); // find user by id

    if (!user) {
      user = await ServiceProviders.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }

    if (user.otp !== otp) {
      return res.status(404).json({ success: false, message: "Invalid OTP" });
    }

    user.otp = null;
    user.verified = true;
    user.save();
    res.json({ success: true, user, message: "Account Verified." });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 ** Resend OTP
 * @param {object} req
 * @param {object} res
 */
exports.resendOtp = async (req, res) => {
  try {
    let { userId } = req.params;

    let user = await Users.findById(userId); // get user by id

    if (!user) {
      user = await ServiceProviders.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }

    let otp = Math.random().toFixed(4).slice(-4); // Generate random otp

    user.otp = otp; // allot new otp to user
    user.save(); // save user object

    //! uncomment send otp
    //TODO: Change Phone number format to french before production.
    // Send OTP message to user phone number
    // sendOTP(user.phone, otp)
    //   .then(() => {
    // On success
    return res.json({
      success: true,
      message: "OTP sent",
      user,
    }); //Success
    // })
    // .catch((err) => {
    //   // On error
    //   throw err;
    // });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
