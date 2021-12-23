/**
 * Category CRUD controllers
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const Categories = require("../models/categories");

/**
 * Create New - Service
 * @param {object} req
 * @param {object} res
 */

exports.create = async (req, res) => {
  try {
    //Setting path for multiple images
    let { category } = req.body;
    const existingCategories = await Categories.findOne({ category }); // Finding already existing categories
    if (existingCategories) {
      return res
        .status(409)
        .json({ success: false, message: "Category already exists." });
    } else {
      const categories = await Categories.create(req.body); //Adding new Category in db
      if (Categories) res.status(200).json({ success: true, categories });
      //Success
      else
        res
          .status(404)
          .json({ success: false, message: "Unable to add new service" }); //Any error while adding new service
    }
  } catch (err) {
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Fetch All the services from DB
exports.getAll = async (req, res) => {
  try {
    const categories = await Categories.find(); // Finding all the Services from db
    res.status(200).json({ success: true, categories }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Update Category
exports.updatecategory = async (req, res) => {
  try {
    const categoryID = req.params.categoryID; // Getting user id from URL parameter
    const category = await Categories.findByIdAndUpdate(categoryID, req.body, {
      new: true,
    }); // Updating the user
    res.status(202).json({ success: true, category }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Delete Category
exports.deletecategory = async (req, res) => {
  try {
    const categoryID = req.params.categoryID; // Getting user id from URL parameter
    const category = await Categories.findByIdAndDelete(categoryID); // Deleting the user
    res.status(202).json({ success: true, category }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Get Category ById
exports.getbyId = async (req, res) => {
  try {
    const categoryID = req.params.categoryID; // Getting user id from URL parameter
    const category = await Categories.findById(categoryID); // Deleting the user
    if (category) res.status(202).json({ success: true, category });
    // Success
    else res.status(404).json({ success: false, message: "Invalid ID" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
