/**
 * Service provider CRUD controllers
 * @author Najam Ul Saqib
 */
const Users = require('../models/Users');
const ServiceProviders = require('../models/ServiceProviders');
const bcrypt = require('bcryptjs');
const { sendOTP } = require('../utils/sendOTP');
const { translate } = require('../utils/translate');
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { stripeErrors } = require('../utils/stripeErrors');

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password, confirmPassword, phone } = req.body; // Getting required fields from body
    const existingServiceProvider = await ServiceProviders.findOne({ email }); // Finding already existing Service Provider
    const existingUser = await Users.findOne({ email }); // Finding already existing user

    // Extra Validations
    if (existingUser || existingServiceProvider) {
      // If we found existing user in db
      return res.status(409).json({ success: false, message: translate['User already exists.'] });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({
        success: false,
        message: translate['Password and Confirm password should be same.']
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
    req.body.location = JSON.parse(req.body.location);
    let cultureArr = JSON.parse(req.body.culture);
    cultureArr.forEach((val, i) => {
      cultureArr[i] = JSON.parse(val);
    });
    req.body.culture = cultureArr;

    let user = new ServiceProviders(req.body);

    let otpResp = await sendOTP(phone, otp);

    if (otpResp.err) {
      return res.status(400).json({
        success: false,
        message: translate['Invalid Phone number']
      });
    }

    user.save(); // save user object
    res.json({
      success: true,
      message: translate['Account created and otp sent'],
      user
    }); //Success

    // // Adding user in db
    // await ServiceProviders.create(req.body).then((user) => {
    //   // Sending otp to user
    //   sendOTP(phone, otp);
    //   res.json({
    //     success: true,
    //     message: translate["Account created and otp sent"],
    //     user,
    //   }); //Success
    // });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({
      success: false,
      message:
        err.code === 21614 ? translate['Invalid Phone number'] : translate['Internal server error']
    });
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
      { $match: { verified: true } },
      {
        $sample: { size: 10 }
      },
      {
        $project: {
          _id: 1,
          company_name: 1,
          'location.city': 1,
          photo: 1
        }
      }
    ]);
    res.json({ success: true, users: serviceProviders });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
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
    let serviceProvider = await ServiceProviders.findById(userId)
      .populate('services.service')
      .populate('ratings.user', 'first_name last_name photo');
    if (!serviceProvider) {
      return res.json({
        success: false,
        message: translate['No Service provider found']
      });
    }

    res.json({
      success: true,
      user: serviceProvider
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
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
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
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

    if (req.body.culture) {
      let cultureArr = JSON.parse(req.body.culture);
      cultureArr.forEach((val, i) => {
        cultureArr[i] = JSON.parse(val);
      });
      req.body.culture = cultureArr;
    }

    // Getting url of the image
    if (req.files) {
      if (req.files.image) {
        req.body.photo = req.files.image[0].path; // Creating a new property called photo in body object
      }
      if (req.files.cover) {
        let cover = [];
        req.files.cover.forEach(file => {
          cover.push(file.path);
        });
        req.body.cover = cover;
      }
    }

    const user = await ServiceProviders.findByIdAndUpdate(userId, req.body, {
      new: true
    }); // Updating the user
    res.json({
      success: true,
      message: translate['User updated successfully'],
      user
    }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
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
    console.log({ pageNumber, pageSize });
    const serviceproviders = await ServiceProviders.find()
      .skip(pageNumber * pageSize)
      .limit(parseInt(pageSize))
      .sort({ date: -1 }); // Finding all the users from db
    const totalResults = await ServiceProviders.find().countDocuments();
    res.json({ success: true, serviceproviders, totalResults }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

/**
 * Get Service Providers
 * @param {object} req
 * @param {object} res
 */
exports.getAllServiceProviders = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;
    let serviceproviders = await ServiceProviders.find()
      .skip(parseInt(pageNumber) * parseInt(pageSize))
      .limit(parseInt(pageSize));
    // Finding all the users from db
    const totalResults = await ServiceProviders.find().countDocuments();
    serviceproviders = serviceproviders.sort(() => 0.5 - Math.random());
    res.json({ success: true, serviceproviders, totalResults }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.getUsersForMap = async (req, res) => {
  try {
    let serviceProviders = await ServiceProviders.aggregate([
      {
        $project: {
          _id: 1,
          company_name: 1,
          'location.lat': 1,
          'location.lng': 1
        }
      }
    ]);
    return res.json({ users: serviceProviders });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.rateUser = async (req, res) => {
  try {
    let { userId } = req.params;
    let alreadyRated = await ServiceProviders.findOne({
      _id: userId,
      'ratings.user': req.body.user
    });
    if (alreadyRated) {
      alreadyRated = await ServiceProviders.findOneAndUpdate(
        {
          _id: userId,
          'ratings.user': req.body.user
        },
        {
          $set: { 'ratings.$': req.body }
        },
        {
          new: true
        }
      );

      let ratingsSum = alreadyRated.ratings.reduce((prev, cnt) => prev + cnt.rating, 0);
      let rating = (ratingsSum / (alreadyRated.ratings.length || 1)).toFixed(1);

      alreadyRated.rating = rating;
      alreadyRated.save();

      return res.json({
        success: true,
        message: translate['Rating Updated']
      });
    } else {
      let serviceProvider = await ServiceProviders.findById(userId);
      serviceProvider.ratings.push(req.body);

      let ratingsSum = alreadyRated.ratings.reduce((prev, cnt) => prev + cnt.rating, 0);
      let rating = (ratingsSum / (alreadyRated.ratings.length || 1)).toFixed(1);

      serviceProvider.rating = rating;

      serviceProvider.save();
      res.json({
        success: true,
        message: translate['Thank You for rating']
      });
    }
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* CREATING STRIPE CONNECTED ACCOUNT
exports.addBank = async (req, res) => {
  try {
    let { userId } = req.params;
    let { phone, DOB, bankName, iban } = req.body;
    DOB = JSON.parse(DOB);
    const accountToken = req.body.token;
    const personToken = req.body.personToken;

    let front = req.files['front'] !== undefined ? req.files['front'][0].path : '';
    front !== '' && (front = front.replace(/\\/g, '/'));

    let back = req.files['back'] !== undefined ? req.files['back'][0].path : '';
    back !== '' && (back = back.replace(/\\/g, '/'));

    let serviceProvider = await ServiceProviders.findById(userId);
    if (!serviceProvider) {
      return res.status(404).json({ success: false, message: translate['No user Found'] });
    }

    // creating company account
    const account = await stripe.account.create({
      type: 'custom',
      country: 'FR',
      account_token: accountToken,
      email: serviceProvider.email,
      business_profile: {
        name: serviceProvider.name,
        mcc: '5811',
        url: 'http://google.com'
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      external_account: {
        object: 'bank_account',
        account_number: iban,
        bank_name: bankName,
        country: 'FR',
        currency: 'eur'
      }
    });

    //Creating person / representative of company
    var person = await stripe.accounts.createPerson(
      account.id, // id of the account created earlier
      {
        person_token: personToken
      }
    );

    serviceProvider.bank.phone = phone;
    serviceProvider.bank.DOB = DOB;
    serviceProvider.bank.bankName = bankName;
    serviceProvider.bank.iban = iban;
    serviceProvider.bank.stripeID = account.id;
    serviceProvider.bank.personID = person.id;
    serviceProvider.bank.front = front;
    serviceProvider.bank.back = back;

    serviceProvider.save();

    res.status(200).send({ success: true, message: translate['Bank Account added'] });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({
      success: false,
      message:
        stripeErrors[err.code] ??
        stripeErrors[err.param.replace(']', '').split('[')[1]] ??
        translate['Internal server error']
    });
  }
};

exports.EditBank = async (req, res) => {
  try {
    let { userId } = req.params;

    let serviceProvider = await ServiceProviders.findById(userId);
    if (!serviceProvider) {
      return res.status(404).json({ success: false, message: translate['No user Found'] });
    }

    const accountLink = await stripe.accountLinks.create({
      account: serviceProvider.bank.stripeID,
      refresh_url: `${process.env.CLIENT_URL}/redirect=true`,
      return_url: `${process.env.CLIENT_URL}/redirect=true`,
      type: 'account_update'
    });
    res.status(200).json({ success: true, url: accountLink });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({
      success: false,
      message: translate['Internal server error']
    });
  }
};

exports.turnOffNotifications = async (req, res) => {
  try {
    let { userId } = req.params;
    const user = await ServiceProviders.findById(userId);

    user.notification = !user.notification;
    user.save();
    res.json({ success: true, notification: user.notification });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};
