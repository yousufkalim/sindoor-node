/**
 * Services CRUD controllers
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const Categories = require("../models/categories");
const Services = require("../models/services");
const { findDistance } = require("../utils/findDistance");
const User = require("../models/Users");
const Providers = require("../models/service_providers");
const mongoose = require("mongoose");
/**
 * Create New - Service
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const categoryId = req.body.category;
    const providerId = req.body.service_provider;
    const findCategory = await Categories.findById(categoryId); //check wether its valid category id comming from request
    const findServiceprovider = await Providers.findById(providerId); //check wether its valid user id comming from request
    if (findCategory && findServiceprovider) {
      //Setting path for multiple images
      if (req.files != undefined && req.files.length != 0) {
        req.body.photo = req.files.map((elm) => elm.path);
      }

      const services = await Services.create(req.body); //Adding new Service in db
      if (services) res.status(200).json({ success: true, services });
      //Success
      else
        res
          .status(404)
          .json({ success: false, message: "Unable to add new service" }); //Any error while adding new service
    } else {
      console.log("404 status");
      res.status(404).json({
        success: false,
        message: "Category id / service provider id  is invalid",
      });
    }
  } catch (err) {
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Fetch All the services from DB
exports.getAll = async (req, res) => {
  try {
    const services = await Services.find(); // Finding all the Services from db
    res.status(200).json({ success: true, services }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Delete a service
exports.delete = async (req, res) => {
  try {
    const serviceId = req.params.serviceId; // Getting user id from URL parameter
    const Service = await Services.findByIdAndDelete({ _id: serviceId }); // Deleting the service
    //If service is deleted then it will send success in response
    if (Service)
      res.status(200).json({ success: true, message: "Service Deleted" });
    // Success
    //Incase of invalid Id
    else res.status(404).json({ success: false, message: "Invalid id" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    //Setting path for multiple image
    if (req.files != undefined && req.files.length != 0) {
      req.body.photo = req.files.map((elm) => elm.path);
    }
    const serviceId = req.params.serviceId; // Getting service id from URL parameter
    const Service = await Services.findByIdAndUpdate(serviceId, req.body, {
      new: true,
    }); // Updating the service
    if (Service) res.status(200).json({ success: true, Service });
    // Success with updated service
    else res.status(404).json({ success: false, message: "Invalid id" }); //incase service id is  invalid
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getBycategory = async (req, res) => {
  try {
    const category = req.params.category; //Getting service category from URL parameter
    const categories = await Services.find({ category }); //find the service based upon categories
    if (categories == "")
      res
        .status(404)
        .json({ success: false, message: "Sorry no search found" });
    else res.status(200).json({ success: true, categories });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Get Nearby Services
exports.getNearby = async (req, res) => {
  try {
    const services = await Services.find();
    const nearby = findDistance(
      req.body.latitude,
      req.body.longitude,
      services
    );
    console.log("data sent to function");
    res.status(200).json({ success: true, nearby });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Get My Services
exports.myservices = async (req, res) => {
  try {
    let providerID = req.params.providerID;
    const serviceProvider = await Providers.findById(providerID);
    if (serviceProvider !== null) {
      const services = await Services.find({ service_provider: providerID });
      if (services) res.status(200).json({ success: true, services });
    } else
      res.status(404).json({ success: false, message: "Invalid providerID" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
