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
    let cultureArr = JSON.parse(req.body.culture);
    cultureArr.forEach((val, i) => {
      cultureArr[i] = JSON.parse(val);
    });
    req.body.culture = cultureArr;

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
 * Get Service Providers
 * @param {object} req
 * @param {object} res
 */
exports.getFew = async (req, res) => {
  try {
    let serviceProviders = await ServiceProviders.aggregate([
      {
        $sample: { size: 10 },
      },
      {
        $project: {
          _id: 1,
          company_name: 1,
          "location.city": 1,
          photo: 1,
        },
      },
    ]);
    res.json({ success: true, users: serviceProviders });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 ** Get User By id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    let { userId } = req.params;
    let serviceProvider = await ServiceProviders.findById(userId).populate(
      "services.service"
    );
    if (!serviceProvider) {
      return res.json({
        success: false,
        message: "No Service provider found",
      });
    }

    let ratingsSum = serviceProvider.ratings.reduce(
      (prev, cnt) => prev + cnt.rating,
      0
    );
    let rating = (ratingsSum / (serviceProvider.ratings.length || 1)).toFixed(
      1
    );

    res.json({
      success: true,
      user: { ...serviceProvider._doc, rating },
    });
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
    if (req.body.location) {
      req.body.location = JSON.parse(req.body.location);
    }

    // Cannot update with this API
    if (req.body.password) {
      req.body.password = undefined;
    }

    // Getting url of the image
    if (req.files) {
      if (req.files.image) {
        req.body.photo = req.files.image[0].path; // Creating a new property called photo in body object
      }
      if (req.files.cover) {
        let cover = [];
        req.files.cover.forEach((file) => {
          cover.push(file.path);
        });
        req.body.cover = cover;
      }
    }

    const user = await ServiceProviders.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // Updating the user
    res.json({
      success: true,
      message: "User updated successfully",
      user,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get Service Providers
 * @param {object} req
 * @param {object} res
 */
exports.getByAdmin = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.body;
    console.log(pageNumber, "pageNumber");
    console.log(pageSize, "pageSize");
    const serviceproviders = await ServiceProviders.find()
      .skip(pageNumber * pageSize)
      .limit(parseInt(pageSize))
      .sort({ date: -1 }); // Finding all the users from db
    const totalResults = await ServiceProviders.find().countDocuments();
    res.json({ success: true, serviceproviders, totalResults }); // Success
     } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
    
exports.getUsersForMap = async (req, res) => {
  try {
    let serviceProviders = await ServiceProviders.aggregate([
      {
        $project: {
          _id: 1,
          company_name: 1,
          "location.lat": 1,
          "location.lng": 1,
        },
      },
    ]);
    // let name = "Sindoor";
    // let id = "62949996c84e7033e4ddc89c";
    // let x = {
    //   _id: "629495fae129f9195a61cab0",
    //   company_name: "Sindoor Inc",
    //   location: {
    //     lat: 48.346613,
    //     lng: -4.308873,
    //   },
    // };
    // let serviceProviders = [];
    // Array(300)
    //   .fill(0)
    //   .forEach((i, j) => {
    //     let _id = x._id;
    //     let company_name = `${name} ${j + 1}`;
    //     if (j % 2 === 0) {
    //       _id = id;
    //     }
    //     serviceProviders.push({
    //       _id: _id,
    //       company_name: company_name,
    //       location: {
    //         lat: parseFloat(
    //           (x.location.lat - Math.random(10) / 200).toFixed(7)
    //         ),
    //         lng: parseFloat(
    //           (x.location.lng - Math.random(10) / 200).toFixed(7)
    //         ),
    //       },
    //     });
    //   });
    return res.json({ users: serviceProviders });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
