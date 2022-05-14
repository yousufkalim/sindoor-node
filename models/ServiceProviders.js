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
      label: String,
      label2: String,
      city: String,
      PostalCode: String,
      lat: Number,
      lng: Number,
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
        rating: Number,
        comment: String,
      },
    ],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "services",
        },
      },
    ],
    online: {
      type: Boolean,
      default: true,
    },
    otp: String,
    photo: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("serviceProviders", serviceProviderSchema);
