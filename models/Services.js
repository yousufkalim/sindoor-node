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
      ref: "serviceProvider",
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
    deposit: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      require: true,
    },
    phone: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("services", serviceSchema);
