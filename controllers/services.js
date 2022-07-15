/**
 * Services CRUD controllers
 * @author Najam Ul Saqib
 */
const Services = require("../models/Services");
const ServiceProviders = require("../models/ServiceProviders");
const { translate } = require("../utils/translate");

//* Get all services of user
exports.getAllByUserID = async (req, res) => {
  try {
    let { userId } = req.params;
    let services = await Services.find({ serviceProvider: userId });
    res.json({ success: true, services });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

exports.getFewByUserId = async (req, res) => {
  try {
    let { userId } = req.params;
    let services = await Services.find({ serviceProvider: userId }).limit(5);
    res.json({ success: true, services });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

//* Create Service
exports.createService = async (req, res) => {
  try {
    let { userId } = req.params;
    let serviceProvider = await ServiceProviders.findById(userId);
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: translate["No Service Provider found."],
      });
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
      serviceProvider.services.push({ service: service._id });
      serviceProvider.save();

      return res.json({
        success: true,
        service,
        message: translate["Service created."],
      });
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

//* edit service
exports.editService = async (req, res) => {
  try {
    let { serviceId } = req.params;
    let body = req.body;
    if (body.location) {
      body.location = JSON.parse(body.location);
    }
    // check if request have images
    let photos = [];
    if (req.files) {
      req.files.forEach((image) => {
        photos.push(image.path);
      });
    }
    if (body.photos) {
      body.photos = [...JSON.parse(body.photos), ...photos];
    } else {
      body.photos = photos;
    }

    await Services.findByIdAndUpdate(serviceId, req.body).then(() => {
      res.json({ success: true, message: translate["Service Updated."] });
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

//* delete service
exports.deleteService = async (req, res) => {
  try {
    let { serviceId } = req.params;
    await Services.findByIdAndDelete(serviceId).then(async (resp) => {
      await ServiceProviders.findOneAndUpdate(
        {
          _id: resp.serviceProvider,
        },
        {
          $pull: {
            services: {
              service: serviceId,
            },
          },
        }
      );
    });
    res.json({ success: true, message: translate["Service deleted."] });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

//* get service by id
exports.getById = async (req, res) => {
  try {
    let { serviceId } = req.params;
    let service = await Services.findById(serviceId);
    // .populate(
    //   "serviceProvider"
    // );
    res.json({ success: true, service });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

exports.getRandomServiceProviders = async (req, res) => {
  try {
    let { category, page } = req.query;
    if (!page) page = 0;
    const limit = 20;
    if (!category) {
      return res.json({
        success: false,
        message: translate["Category is required."],
      });
    }

    let services = await Services.find({ category })
      .skip(page * limit)
      .limit(limit)
      .populate("serviceProvider", "_id company_name location description");
    services.sort(() => Math.random() - 0.5);

    res.json({ success: true, services, page });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};
