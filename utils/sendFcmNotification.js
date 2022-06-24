/**
 * FCM SEND NOTIFICATION
 * @author Najam Ul Saqib
 */

const FCM = require("fcm-node");
const fcm = new FCM(process.env.FCM_SERVER_KEY);

exports.sendFcmNotification = async (tokens, title, body) => {
  try {
    var message = {
      registration_ids: [tokens],
      notification: {
        title: title,
        body: body,
      },
      //   data: data,
    };
    fcm.send(message, (error, response) => {
      if (!error) console.log("Notification sent successfully");
    });
  } catch (err) {
    console.log("Something gone wrong", err.message);
  }
};

// usage
// sendFcmNotification("User Token", "Notif Title", "Message / anything");
