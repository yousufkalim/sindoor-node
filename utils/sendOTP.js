/**
 * Send SMS service
 * @author Najam Ul Saqib
 */

const { translate } = require('./translate');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio account sid
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio account auth token
const phoneNumber = process.env.TWILIO_PHONE_NUMBER; // Twilio account phone number
const client = require('twilio')(accountSid, authToken);

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
        body: `${otp} ${translate['is your Sindoor confirmation code.']}`,
        from: phoneNumber,
        to: `+33${phone.substring(1)}`
      })
      .then(message => {
        // On message successfully sent
        resolve({ success: true, message: translate['OTP sent'] });
      })
      .catch(err => {
        // On error
        reject(err);
      });
  });
};

exports.checkPhone = phone => {
  return client.lookups.phoneNumbers(phone).fetch({ countryCode: 'fr' });
};

exports.sendMessage = (phone, message) => {
  return new Promise((resolve, reject) => {
    client.messages
      .create({
        // message options
        body: message,
        from: phoneNumber,
        to: `+33${phone.substring(1)}`
      })
      .then(message => {
        // On message successfully sent
        resolve({
          success: true,
          message: translate['Message sent']
        });
      })
      .catch(err => {
        // On error
        reject(err);
      });
  });
};
