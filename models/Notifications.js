/**
 * Notification schema
 * @author Najam Ul Saqib
 */

const mongoose = require("mongoose");

// Schema
const NotificationSchema = new mongoose.Schema(
  {
    receiver: String,
    sender: {
      name: String,
      photo: String,
    },
    text: String,
    page: Number,
    id: String,
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("notifications", NotificationSchema);
