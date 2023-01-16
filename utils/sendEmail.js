/**
 * Send email service for forgot password
 * @author Yousuf Kalim
 */
var nodemailer = require('nodemailer');
const { translate } = require('./translate');
const sender_name = process.env.MAILER_DOMAIN;
const sender_email = process.env.MAILER_EMAIL;
const sender_password = process.env.MAILER_PASSWORD;
const contact_email = process.env.CONTACT_EMAIL;

/**
 * sendEmail
 * @param {string} email
 * @param {string} password
 * @return {void}
 */
exports.contactUsEmail = (name, email, message) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password
      }
    });

    // Send email options
    var mailOptions = {
      from: `${name} <${sender_email}>`,
      to: contact_email,
      subject: `${translate['Message from']} ${name}`,
      text: message
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({
          success: true,
          message: translate['Email sent successfully']
        });
      }
    });
  });
};

/**
 * sendEmail
 * @param {string} email
 * @param {string} password
 * @return {void}
 */
exports.sendEmail = (email, password) => {
  return new Promise((resolve, reject) => {
    // Sender mail server config
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender_email,
        pass: sender_password
      }
    });

    // Send email options
    var mailOptions = {
      from: `${sender_name} <${sender_email}>`,
      to: email,
      subject: translate['Your password has been changed'],
      html: EmailTemplate(password),
      attachments: [
        {
          filename: 'logo.png',
          path: process.env.BASE_URL + '/uploads/logo.png',
          cid: 'logo'
        }
      ]
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({
          success: true,
          message: translate['Email sent successfully']
        });
      }
    });
  });
};
const EmailTemplate = password => {
  return `

  <body style="margin: 0; padding: 0">
    <table
      role="presentation"
      style="
        width: 100%;
        border-collapse: collapse;
        border: 0;
        border-spacing: 0;
        background: #ffffff;
      "
    >
      <tr>
        <td align="center" style="padding: 0">
          <table
            role="presentation"
            style="
              width: 602px;
              border-collapse: collapse;
              border: 1px solid #cccccc;
              border-spacing: 0;
              text-align: left;
            "
          >
            <tr>
              <td
                align="center"
                style="padding: 20px 5px 10px 5px; background: rgba(228, 90, 90, 0.1)"
              >
                <img style="height: 42px;" src="cid:logo" />
                <h2 style="
                font-family: Verdana; color: #e45a5a; ">
                  ${translate['Hi there, your password is changed']}
                </h2>
                <h4 style="font-family: Verdana; color: #787878;">
                  ${translate['Your new Password is below']}
                </h4>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                style="
                  padding: 20px 10px 20px 10px;
                  background: rgba(228, 90, 90, 0.3);
                "
              >
              <div style="width: 50%;">
                <h3
                  style="
                    font-family: Verdana;
                    font-size: 35px;
                    background-color: #e45a5a;
                    padding: 2%;
                    color: #F3FFF7;
                    border-radius: 10px;
                  "
                >
                  ${password}
                </h3>
                </div>
                <p align="center" style="
                    font-family: Verdana;
                    color: #787878;">
                  ${translate['Use this password to login now.']}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p align="center" style="color: #000; font-family: Verdana">
                  ${translate['This email is generated automatically please do not reply.']}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
`;
};
