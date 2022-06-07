/**
 * Booking CRUD controllers
 * @author Najam Ul Saqib
 */

const moment = require("moment");

exports.SendRequest = (req, res) => {
  try {
    let { body } = req;
    let duration = moment(body.end_date).diff(moment(body.start_date), "hours");
    res.json({ duration, ...body });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
