/**
 * Sockets
 * @author Najam Ul Saqib
 */

const Users = require("../models/Users");
const ServiceProviders = require("../models/ServiceProviders");
const Chats = require("../models/Chats");

module.exports = (io) => {
  // Socket
  io.on("connection", (socket) => {
    console.log("User connected to socket ;)");
    //
    socket.on("message", async (data) => {
      const { chatId, message, to } = data;
      let chat = await Chats.findById(chatId);
      if (chat) {
        chat.messages.push(message);
        chat.last = message.date;
        chat.save();
      }
      socket.broadcast.emit(`listener${to}`, message);
    });

    socket.on("seen", async (data) => {
      await Chats.findOneAndUpdate(
        {
          _id: data.chatId,
        },
        {
          $set: {
            "messages.$[msg].seen": "seen",
          },
        },
        {
          arrayFilters: [
            {
              "msg.from": {
                $ne: data.userId,
              },
            },
          ],
        }
      );
    });

    socket.on("online", async (data) => {
      //change user status to online
      let user = await Users.findById(data.userId);
      if (user) {
        //   update user status
        user.online = true;
        user.save();
      } else {
        // update status of service provider
        user = await ServiceProviders.findByIdAndUpdate(
          data.userId,
          { online: true },
          { new: true }
        );
      }
    });
    socket.on("offline", async (data) => {
      // change user status to offline
      let user = await Users.findById(data.userId);
      if (user) {
        //   update user status
        user.online = false;
        user.save();
      } else {
        // update status of service provider
        user = await ServiceProviders.findByIdAndUpdate(
          data.userId,
          { online: false },
          { new: true }
        );
      }
    });
  });
};
