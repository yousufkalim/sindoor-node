/**
 * bookings CRUD controllers
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const bookings = require("../models/bookings");
const Services = require("../models/services");
const Users = require("../models/Users");
const Providers = require("../models/service_providers");
const io = require("../utils/socket-io");

/**
 * Create New - Request
 * @param {object} req
 * @param {object} res
 */

exports.create = async (req, res) => {
  try {
    let { service, client, service_provider } = req.body;
    const existingService = await Services.findById(service); // Finding already existing categories
    const existingClient = await Users.findById(client);
    const existingServiceprovider = await Providers.findById(service_provider);
    console.log("Found all models");
    if (existingService && existingClient && existingServiceprovider) {
      const request = await bookings.create(req.body); // Adding request in db

      let data = {
        Title: "You got a new notification",
        Message: "From" + existingClient + "Request for a service",
        service_provider: service_provider,
        client_name: existingClient.first_name,
        clientPic: existingClient.photo,
        service: existingService,
        clientID: client,
        requestID: request.id,
      };
      console.log("data", data);
      io.requestnotification(data).then(async () => {
        return res.status(202).json({
          success: true,
          message: "Service request sent",
          RequestID: request.id,
          client_name: existingClient.first_name,
          clientPic: existingClient.photo,
          service: existingService,
        });
      });
    } else {
      return res.status(409).json({
        success: false,
        message: "Invalid Service id /client id /service_provideriD",
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
    let userID = req.params.userID;
    let role = req.params.role;
    
    if (role == "ServiceProvider") {
      let findUser = await Providers.findById(userID);
      if (findUser !== null) {
        const Bookings = await bookings.find({
          service_provider: userID,
        }).populate("service");
        
        if (Bookings.length >= 1)
          res.status(200).json({ success: true, Bookings });
        else
          res
            .status(404)
            .json({ success: false, message: "You don't have request yet" });
      } else res.status(404).json({ success: false, message: "Invalid ID" });
    } else {
      let findUser = await Users.findById(userID);

      if (findUser !== null) {
        const Bookings = await bookings.find({ client: userID }).populate(
          "service"
        );
        console.log(findUser, "User");
        if (Bookings.length >= 1)
          res.status(200).json({ success: true, Bookings });
        else
          res
            .status(404)
            .json({ success: false, message: "You don't have request yet" });
      } else res.status(404).json({ success: false, message: "Invalid ID" });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//get request aacording to status
exports.getBystatus = async (req, res) => {
  try {
    const { status, userID, role } = req.params; //Getting service category from URL parameter
    if (role == "ServiceProvider") {
      const findUser = await Providers.findById(userID);
      if (findUser !== null) {
        const RequestbyProvider = await bookings.find({
          status: status,
          service_provider: userID,
        }).populate("service"); //find the service based upon status and if ServiceProvider is requesting
        if (RequestbyProvider.length >= 1)
          res.status(200).json({ success: true, RequestbyProvider });
        else
          res
            .status(404)
            .json({ success: false, message: "You don't have request yet" });
      } else {
        res.status(404).json({ success: false, message: "Invalid userID" });
      }
    } else {
      const findUser = await Users.findById(userID);
      if (findUser !== null) {
        const RequestbyClient = await bookings.find({
          status: status,
          client: userID,
        }).populate("service"); //find the service based upon status and if oragnizer is requesting
        if (RequestbyClient.length >= 1)
          res.status(200).json({ success: true, RequestbyClient });
        else
          res
            .status(404)
            .json({ success: false, message: "You don't have request yet" });
      } else {
        res.status(404).json({ success: false, message: "Invalid userID" });
      }
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.requestResponse = async (req, res) => {
  try {
    let { id, service_provider, status, client } = req.body;
    const existingRequest = await bookings.findById(id); //Check whether its valid id of request
    if (existingRequest != null) {
      const existingService = await Services.findById(existingRequest.service);
      const existingservice_provider = await Providers.findById(
        existingRequest.service_provider
      );
      console.log(existingservice_provider, "provider working");
      //to check whether  clientId and serviceProvider id related to the same request

      if (
        existingRequest.service == existingService.id &&
        existingRequest.client == client &&
        existingRequest.service_provider == service_provider
      ) {
        existingRequest.status = status;
        await existingRequest.save();
        console.log(existingRequest);
        let data = {
          Title: "You got a new notification",
          Message: " From" + client + "Request for a service",
          client: client,
          bookingstatus: existingRequest.status,
          ServiceProvider: existingservice_provider.first_name,
          ServiceproviderPhone: existingservice_provider.phone,
          ServiceproviderPic: existingservice_provider.photo,
          RequestedService: existingService,
        };
        io.responsenotification(data).then(async () => {
          res.status(200).json({
            success: true,
            bookingstatus: existingRequest.status,
            ServiceProvider: existingservice_provider.first_name,
            ServiceproviderPhone: existingservice_provider.phone,
            ServiceproviderPic: existingservice_provider.photo,
            RequestedService: existingService,
          });
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Invalid RequestId or ServiceProviderid",
        });
      }
    } else {
      res.status(404).json({ success: false, message: "Invalid" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
