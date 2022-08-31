/**
 * Services CRUD controllers
 * @author Najam Ul Saqib
 */
const Services = require("../models/Services");
const ServiceProviders = require("../models/ServiceProviders");
const { translate } = require("../utils/translate");
const { findDistance } = require("../utils/findDistance");

//* Get all services of user
exports.getAllByUserID = async (req, res) => {
  try {
    let { userId } = req.params;
    let services = await Services.find({
      serviceProvider: userId,
      deleted: false,
    });
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
    let services = await Services.find({
      serviceProvider: userId,
      deleted: false,
    }).limit(5);
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
    if (req.files.photos) {
      req.files.photos.forEach((image) => {
        photos.push(image.path);
      });
    }
    let video = "";
    if (req.files.video) {
      video = req.files.video[0].path;
    }

    req.body.serviceProvider = userId;
    req.body.photos = photos;
    req.body.video = video;
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
    if (req.files.photos) {
      req.files.photos.forEach((image) => {
        photos.push(image.path);
      });
    }

    if (body.photos) {
      body.photos = [...JSON.parse(body.photos), ...photos];
    } else {
      body.photos = photos;
    }

    if (req.files.video) {
      req.body.video = req.files.video[0].path;
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
    await Services.findByIdAndUpdate(serviceId, { deleted: true }).then(
      async (resp) => {
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
      }
    );
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

exports.getRandomServices = async (req, res) => {
  try {
    let { category, page } = req.query;
    if (!page) page = 0;
    const limit = 20;

    let services = await Services.find({ category, deleted: false })
      .skip(page * limit)
      .limit(limit)
      .populate(
        "serviceProvider",
        "_id company_name location description photo"
      );
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

exports.getFilteredServices = async (req, res) => {
  try {
    let { radius, rating, lat, lng, category, page } = req.query;

    if (!page) page = 0;
    const limit = 20;
    let pipeline = [];

    pipeline.push({
      $lookup: {
        from: "services",
        localField: "services.service",
        foreignField: "_id",
        as: "services",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$services",
      },
    });

    pipeline.push(
      category // check if category variable exists
        ? {
            $match: {
              rating: {
                $gte: rating ? +rating : 0,
              },
              "services.deleted": false,
              "services.category": category,
            },
          }
        : {
            $match: {
              rating: {
                $gte: rating ? +rating : 0,
              },
              "services.deleted": false,
            },
          }
    );

    pipeline.push({
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$services"],
        },
      },
    });

    const services = await ServiceProviders.aggregate(pipeline)
      .skip(page * limit)
      .limit(limit); // find services from service provider modal

    let results = await findDistance(lat, lng, radius, services); // get distance

    let populated_results = await ServiceProviders.populate(results, {
      path: "serviceProvider",
      select: "_id company_name location description photo rating",
    }); // populate data

    populated_results.sort(() => Math.random() - 0.5); // randomize services.

    res.json({
      success: true,
      services: populated_results,
      page,
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};
