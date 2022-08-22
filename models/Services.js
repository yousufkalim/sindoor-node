/**
 * Services schema
 * @author Najam Ul Saqib
 */
const mongoose = require("mongoose");

// Schema
const serviceSchema = new mongoose.Schema(
  {
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "serviceProviders",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photos: [],
    video: String,
    location: {
      label: String,
      label2: String,
      city: String,
      PostalCode: String,
      lat: Number,
      lng: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["fixed", "estimated"],
      default: "fixed",
    },
    deposit: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      require: true,
    },
    phone: String,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("services", serviceSchema);
