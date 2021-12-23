const io = require("../index");
/*
   if client requests for a new serrvice
   the service provider receives request as a notification
   */
exports.requestnotification = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      io.emit(`${data.service_provider}`, {
        data: data,
      });
      console.log(data);
      resolve({ success: true, message: "Notification sent successfully" });
    } catch (error) {
      reject(error);
    }
  });
};
/*
   In response of incoming request  this function
   is responsible of sending notification the 
   client who requested
   */
exports.responsenotification = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      io.emit(`${data.client}`, {
        data: data,
      });
      console.log(data);
      resolve({ success: true, message: "Notification sent successfully" });
    } catch (error) {
      reject({ success: false, message: "Notification not sent " });
    }
  });
};

