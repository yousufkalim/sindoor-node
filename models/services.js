/**
 * Services schema
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    category: {
      //It will store the Id of selected category
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    service_provider: {
      //It will store the Id of selected Service Provider
      type: mongoose.Schema.Types.ObjectId,
      ref: "service_providers",
      required: true,
    },
    service_for: {
      //Per Day or Per Hour
      type: String,
      required: true,
      enum: ["Per Day", "Per Hour"],
    },
    location: {
      lat: String,
      lng: String,
      label1: String,
      label2: String,
      city: String,
      postal_code: String,
    },
    photo: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("services", serviceSchema);
