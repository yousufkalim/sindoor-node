/**
 * Sockets
 * @author Najam Ul Saqib
 */

const Users = require("../models/Users");
const ServiceProviders = require("../models/ServiceProviders");

module.exports = (io) => {
  // Socket
  io.on("connection", (socket) => {
    console.log("User connected to socket ;)");
    //
    socket.on("message", (data) => {
      console.log(data.to);
      socket.broadcast.emit("listener", data);
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
