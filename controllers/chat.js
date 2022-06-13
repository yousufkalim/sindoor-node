const Chats = require("../models/Chats");
const Users = require("../models/Users");
const ServiceProviders = require("../models/ServiceProviders");

exports.getChatData = async (req, res) => {
  try {
    let { chatId, userId, myId, page } = req.query;

    if (!page) page = 0; //? on first request if there is no page number
    let limit = 50; //? limit 50 messages per request
    let skip = +page * limit; //? skip multiple of page to 50 on every request
    let nextPage = +page + 1; //? next page number

    if (chatId) {
      // Only Get Data.
      let chat = await Chats.findById(chatId).populate(
        "serviceProvider users.user",
        "first_name last_name photo company_name online"
      );

      return res.json({ chat, nextPage, page });
    } else if (userId && myId) {
      // check if user have chat created
      let alreadyChat = await Chats.findOne(
        {
          $and: [
            {
              $or: [
                {
                  serviceProvider: myId,
                },
                {
                  "users.user": myId,
                },
              ],
            },
            {
              $or: [
                {
                  serviceProvider: userId,
                },
                {
                  "users.user": userId,
                },
              ],
            },
          ],
        }
        // {
        //   messages: {
        //     $slice: [skip, limit],
        //   },
        // }
      ).populate(
        "serviceProvider users.user",
        "first_name last_name photo company_name online"
      );
      if (alreadyChat) {
        return res.json({ chat: alreadyChat, nextPage, page });
      } else {
        // Create Chat and get Data

        let chat = new Chats();

        // check user if they are service provider or user
        let user = await Users.findById(userId);
        if (user) {
          chat.users.push({ user: userId });
        } else {
          chat.serviceProvider = userId;
        }
        let serviceProvider = await ServiceProviders.findById(myId);
        if (serviceProvider) {
          chat.serviceProvider = myId;
        } else {
          chat.users.push({ user: myId });
        }
        chat.save();
        chat = await chat
          .populate(
            "serviceProvider users.user",
            "first_name last_name photo company_name online"
          )
          .execPopulate();
        return res.json({ chat });
      }
    } else {
      return res.json({ message: "Params required" });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    let { userId } = req.params;
    let chats = await Chats.find(
      {
        $or: [
          {
            serviceProvider: userId,
          },
          {
            "users.user": userId,
          },
        ],
      },
      {
        // Get last message only.
        messages: { $slice: -1 },
      }
    )
      .sort({ last: -1 })
      .populate(
        "serviceProvider users.user",
        "first_name last_name photo company_name online"
      );

    res.json({ chats });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
