/**
 * App Pictures CRUD controllers
 * @author Shuja Naqvi
 */
const Pictures = require('../models/AppPicture');

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }
    const picture = await Pictures.create(req.body);
    res.json({ success: true, picture }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all pictures
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const pictures = await Pictures.find(); // Finding all the pictures from db
    res.json({ success: true, pictures }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get Two Active
 * @param {object} req
 * @param {object} res
 */
exports.getTwo = async (req, res) => {
  try {
    const pictures = await Pictures.find({ active: true }).limit(2); // Finding all the pictures from db
    res.json({ success: true, pictures }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const pictureId = req.params.pictureId; // Getting user id from URL parameter
    let picture = await Pictures.findById(pictureId); // Finding user by id
    res.json({ success: true, picture }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update picture
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const { pictureId } = req.params; // Getting picture id from URL parameter

    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }

    const picture = await Pictures.findByIdAndUpdate(pictureId, req.body, { new: true }); // Updating the user
    res.json({ success: true, message: 'User updated successfully', picture }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const { pictureId } = req.params; // Getting user id from URL parameter
    const picture = await Pictures.findByIdAndDelete(pictureId); // Deleting the user
    res.json({ success: true, picture }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
