/**
 * Booking CRUD controllers
 * @author Najam Ul Saqib
 */

const moment = require("moment");
const Bookings = require("../models/Bookings");

exports.SendRequest = async (req, res) => {
  try {
    let { body } = req;
    let duration = moment(body.end_date).diff(
      moment(body.start_date),
      "minute"
    );
    duration = (duration / 60).toFixed(1);

    body.duration = duration;

    let booking = new Bookings(body);

    booking.save();

    res.json({ success: true, message: "Request sent to Service Provider." });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getRequests = async (req, res) => {
  try {
    let { userId } = req.params;
    let requests = await Bookings.find({
      serviceProvider: userId,
      paid: "nill",
      status: { $in: ["accepted", "pending"] },
    })
      .sort("-createdAt")
      .populate(
        "service user event",
        "name first_name last_name location type photo description"
      );
    res.json({ success: true, requests });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getRequestsByEventId = async (req, res) => {
  try {
    let { eventId } = req.params;
    let bookings = await Bookings.find({
      event: eventId,
      status: { $in: ["accepted", "pending"] },
    }).populate(
      "service user event serviceProvider",
      "name first_name last_name location type photo company_name"
    );
    res.json({ success: true, bookings });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    let { requestId } = req.params;
    let { final_price, deposit_price } = req.body;
    if (+deposit_price > +final_price) {
      return res.status(400).json({
        success: false,
        message: "Deposit price must be lower than final price.",
      });
    }
    await Bookings.findByIdAndUpdate(requestId, {
      final_price,
      deposit_price,
      status: "accepted",
    });

    res.json({ message: "Price / Status Updated" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    let { requestId } = req.params;

    await Bookings.findByIdAndUpdate(requestId, { status: "rejected" });

    res.json({ message: "Request rejected." });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
