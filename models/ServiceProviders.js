/**
 * Service Provider schema
 * @author Najam Ul Saqib
 */
const mongoose = require("mongoose");

// Schema
const serviceProviderSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      name: String,
      lat: String,
      lng: String,
    },
    cultures: [],
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("serviceProviders", serviceProviderSchema);
