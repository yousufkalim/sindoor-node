/**
 * User schema
 * @author Yousuf Kalim
 * @author Najam Ul Saqib
 */
const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    phone: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    otp: String,
    photo: String,
    fcmToken: String,
    bank: {
      phone: String,
      DOB: Date,
      bankName: String,
      iban: String,
      stripeID: String,
      front: String,
      back: String,
    },
    notification: {
      type: Boolean,
      default: true
    },
    events: [
      {
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "events",
        },
        role: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    facebook: String,
    google: String,
    apple: String,
    favorites: [],
    online: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("users", userSchema);
