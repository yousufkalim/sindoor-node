/**
 * Notifications
 * @author Najam Ul Saqib
 */

const Notifications = require("../models/Notifications");
const { translate } = require("../utils/translate");

exports.getByUserID = async (req, res) => {
  try {
    let { userId } = req.params;
    let notifications = await Notifications.find({ receiver: userId }).sort(
      "-createdAt"
    );
    res.json({ success: true, notifications });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

exports.getCount = async (req, res) => {
  try {
    let { userId } = req.params;
    let count = await Notifications.find({
      receiver: userId,
      read: false,
    }).count();
    res.json({ success: true, count });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    let { notificationId } = req.params;
    await Notifications.findByIdAndUpdate(notificationId, { read: true });
    res.json({ success: true });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    let { userId } = req.params;
    await Notifications.updateMany(
      { receiver: userId, read: false },
      { read: true }
    );
    res.json({ success: true });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    let { userId } = req.params;
    await Notifications.deleteMany({ receiver: userId });
    res.json({ success: true });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res
      .status(500)
      .json({ success: false, message: translate["Internal server error"] });
  }
};
