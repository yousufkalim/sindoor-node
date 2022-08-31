/**
 * App Pictures CRUD controllers
 * @author Shuja Naqvi
 */
const Pictures = require("../models/AppPicture");

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    // Getting url of the image

    req.body.active = JSON.parse(req.body.active);
    if (req.body.active) {
      await Pictures.findOneAndUpdate(
        { active: true },
        { active: false },
        { new: true }
      );
    }
    if (req.files) {
      req?.files?.eventImage?.map((e) => {
        req.body.eventImage = e.path;
      });
      req?.files?.codeImage?.map((e) => {
        req.body.codeImage = e.path;
      });
    }
    const picture = await Pictures.create(req.body);
    res.json({ success: true, picture }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get  Active
 * @param {object} req
 * @param {object} res
 */
exports.getActive = async (req, res) => {
  try {
    const pictures = await Pictures.findOne({ active: true }); // Finding all the pictures from db
    res.json({ success: true, pictures }); // Success
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
    const pictureId = req.params.pictureId; // Getting user id from URL parameter
    let picture = await Pictures.findById(pictureId); // Finding user by id
    res.json({ success: true, picture }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    req.body.active = JSON.parse(req.body.active);
    if (req.body.active) {
      await Pictures.findOneAndUpdate(
        { active: true },
        { active: false },
        { new: true }
      );
    }
    if (req.files) {
      req?.files?.eventImage?.map((e) => {
        req.body.eventImage = e.path;
      });
      req?.files?.codeImage?.map((e) => {
        req.body.codeImage = e.path;
      });
    }

    const picture = await Pictures.findByIdAndUpdate(pictureId, req.body, {
      new: true,
    }); // Updating the user
    res.json({
      success: true,
      message: "Pictures updated successfully",
      picture,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    let picture = await Pictures.findById(pictureId); // Deleting the user
    if (picture.active) {
      await Pictures.findOneAndUpdate(
        { active: false },
        { active: true },
        { new: true }
      );
    }
    picture = await Pictures.findByIdAndDelete(pictureId); // Deleting the user
    res.json({ success: true, picture }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
