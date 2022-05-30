"use strict";

/**
 * Event Pictures schema
 * @author Najam Ul Saqib
 */
var mongoose = require("mongoose"); //Schema


var PictureSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "events"
  },
  picture: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  }],
  status: {
    type: String,
    "enum": ["pending", "approved", "rejected"],
    "default": "pending"
  }
}, {
  timestamps: true
}); // Model

module.exports = mongoose.model("pictures", PictureSchema);