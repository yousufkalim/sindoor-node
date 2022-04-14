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
    culture: [],
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
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        ratings: Number,
      },
    ],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    otp: String,
    photo: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("serviceProviders", serviceProviderSchema);
