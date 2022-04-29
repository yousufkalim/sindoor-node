/**
 * Services CRUD controllers
 * @author Najam Ul Saqib
 */
const Services = require("../models/Services");
const ServiceProviders = require("../models/ServiceProviders");

//* Get all services of user
exports.getAllByUserID = async (req, res) => {
  try {
    let { userId } = req.params;
    let services = await Services.find({ serviceProvider: userId });
    res.json({ success: true, services });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//* Create Service
exports.createService = async (req, res) => {
  try {
    //todo: create service and push in service provider model
    let { userId } = req.params;
    let serviceProvider = await ServiceProviders.findById(userId);
    if (!serviceProvider) {
      return res
        .status(404)
        .json({ success: false, message: "No Service Provider found." });
    }
    // store fille path into array
    let photos = [];
    if (req.files) {
      req.files.forEach((image) => {
        photos.push(image.path);
      });
    }

    req.body.serviceProvider = userId;
    req.body.photos = photos;
    req.body.location = JSON.parse(req.body.location);

    await Services.create(req.body).then((service) => {
      //todo push service id in service provider model
      serviceProvider.services.push({ service: service._id });
      serviceProvider.save();

      return res.json({ success: true, service, message: "Service created." });
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//* edit service
exports.editService = async (req, res) => {
  try {
    let { serviceId } = req.params;
    res.json({ success: true, serviceId });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//* delete service
exports.deleteService = async (req, res) => {
  try {
    //todo: delete service from service provider model
    let { serviceId } = req.params;
    res.json({ success: true, serviceId });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//* get service by id
exports.getById = async (req, res) => {
  try {
    let { serviceId } = req.params;
    res.json({ success: true, serviceId });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
