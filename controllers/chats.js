/**
 * Chat  controllers
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const Chats = require("../models/chats");
const Users = require("../models/Users");
const Providers = require("../models/service_providers");
/**
 * Create New - Request
 * @param {object} req
 * @param {object} res
 */

exports.create = async (req, res) => {
  try {
    let { Organizer, Service_provider } = req.body;
    let existingOrganizer = await Users.findById(Organizer);
    let existingProvider = await Providers.findById(Service_provider);
    if (existingProvider && existingOrganizer) {
      let existingChat = await Chats.find({
        Organizer: Organizer,
        Service_provider: Service_provider,
      });
      if (existingChat.length < 1) {
        let chat = await Chats.create(req.body);
        if (chat)
          res.status(202).json({
            success: true,
            message: "chat has been initialized",
            chatID: chat._id,
            Provider: existingProvider.first_name,
            Organizer: existingOrganizer.first_name,
          });
        else
          res
            .status(404)
            .json({ success: false, message: "Unable to intialize app" });
      } else {
        res.status(404).json({
          succes: false,
          message: "Chat Already exits",
          chatID: existingChat[0]._id,
          Provider: existingProvider.first_name,
          Organizer: existingOrganizer.first_name,
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Invalid Organizer or ServiceProvider",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//get message of a specific chat based upon chatiD
exports.getById = async (req, res) => {
  try {
    let id = req.params.chatID;
    let findchat = await Chats.findById(id);
    if (findchat)
      res.status(202).json({ succes: true, chatinfo: findchat.chat_info });
    else
      res.status(404).json({
        succes: false,
        message: "invalid chatID",
      });
  } catch (err) {
    res.status(500).json({ succes: false, message: "Internal server error" });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    var info = [];
    let userID = req.params.userID;
    if (req.params.role == "ServiceProvider") {
      let findUser = await Providers.findById(userID);
      if (findUser !== null) {
        let chatSP = await Chats.find({ Service_provider: userID }).populate(
          "Organizer"
        );
        console.log(chatSP);
        if (chatSP.length > 0) {
          for (var i = 0; i < chatSP.length; i++) {
            var data = {
              chatID: chatSP[i].id,
              Organizer: chatSP[i].Organizer,
              service_providerID: chatSP[i].Service_provider,
              updatedAt: chatSP[i].updatedAt,
            };
            info.push(data);
          }
          res.status(202).json({
            success: true,
            chats: info,
          });
        } else
          res.status(404).json({
            succes: false,
            message: "No Chat History",
          });
      }
      else
      res.status(404).json({success:false,message:"Invalid ID"})
    } else if (req.body.role == "Organizer") {
      if (findUser !== null && findUser.role == "Organizer") {
        console.log(userID);
        let chatCL = await Chats.find({ Organizer: userID }).populate(
          "Service_provider"
        );
        console.log("CHATCL LENGTH", chatCL.length);
        if (chatCL.length > 0) {
          for (var i = 0; i < chatCL.length; i++) {
            var data = {
              chatID: chatCL[i].id,
              OrganizerID: chatCL[i].Organizer,
              service_provider: chatCL[i].Service_provider,
              updatedAt: chatCL[i].updatedAt,
            };
            info.push(data);
          }
          res.status(202).json({
            success: true,
            chats: info,
          });
        } else
          res.status(404).json({
            succes: false,
            message: "No chat history",
          });
      }
    } else {
      res.status(404).json({
        succes: false,
        message: "Invalid UserID",
      });
    }
  } catch (err) {
    res.status(500).json({
      succes: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
