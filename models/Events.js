/**
 * Events schema
 * @author Najam Ul Saqib
 */

const mongoose = require("mongoose");

// Schema
const EventSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  location: {
    name: String,
    lat: String,
    lng: String,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  photos: [],
  serviceProviders: [
    {
      serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services",
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "refused"],
        default: "pending",
      },
    },
  ],
  guests: [
    {
      guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      role: {
        type: String,
        enum: ["Co-Organizer", "Guest"],
        default: "Guest",
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "refused"],
        default: "pending",
      },
      members: {
        type: Number,
        default: 0,
      },
    },
  ],
});

// Model
module.exports = mongoose.model("events", EventSchema);
