/**
 * Sockets
 * @author Najam Ul Saqib
 */

const Users = require("../models/Users");
const ServiceProviders = require("../models/ServiceProviders");
const Chats = require("../models/Chats");
const Notifications = require("../models/Notifications");

module.exports = (io) => {
  // Socket
  io.on("connection", (socket) => {
    console.log("User connected to socket ;)");
    //
    socket.on("message", async (data) => {
      const { chatId, message, to } = data;
      socket.broadcast.emit(`listener${to}`, message);
      io.sockets.emit(`message${chatId}`, { ...message, seen: "sent" });
      let chat = await Chats.findById(chatId);
      if (chat) {
        chat.messages.push(message);
        // = [message].concat(chat.messages);
        chat.last = message.date;
        chat.save();
      }
    });

    socket.on("seen", async (data) => {
      socket.broadcast.emit(`seen${data.userId}`, { userId: data.userId });
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
      // send Online socket to user
      socket.broadcast.emit(`status${data.userId}`, {
        online: true,
      });
      // change online status in db.
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
      // send Online socket to user
      socket.broadcast.emit(`status${data.userId}`, {
        online: false,
      });
      // change online status in db.
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

    socket.on("notification", async (data) => {
      socket.broadcast.emit(`notification${data.receiver}`, {
        ...data,
        read: false,
      });
      await Notifications.create(data);
    });
  });
};
