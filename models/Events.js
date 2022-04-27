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
  start_date: {
    date: Date,
    start_time: String,
    end_time: String,
  },
  end_date: {
    date: Date,
    start_time: String,
    end_time: String,
  },
  location: {
    label: String,
    label2: String,
    city: String,
    PostalCode: String,
    lat: Number,
    lng: Number,
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
  timeline: [
    {
      title: String,
      description: String,
      start_date: Date,
      start_time: String,
      end_date: Date,
      end_time: String,
    },
  ],
});

// Model
module.exports = mongoose.model("events", EventSchema);
