/**
 * Send SMS service
 * @author Najam Ul Saqib
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio account sid
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio account auth token
const phoneNumber = process.env.TWILIO_PHONE_NUMBER; // Twilio account phone number
const client = require("twilio")(accountSid, authToken);

/**
 * Send OTP to user
 * @param {String} phone
 * @param {String} otp
 */
exports.sendOTP = (phone, otp) => {
  return new Promise((resolve, reject) => {
    // Sending message to client
    client.messages
      .create({
        // message options
        body: `Your OTP is ${otp}`,
        from: phoneNumber,
        to: phone,
      })
      .then((message) => {
        // On message sucessfully sent
        resolve({ success: true, message: "OTP sent" });
      })
      .catch((err) => {
        // On error
        reject(err);
      });
  });
};
