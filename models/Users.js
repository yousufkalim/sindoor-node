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
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    phone: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    otp: String,
    photo: String,
    events: [
      {
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "events",
        },
        role: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("users", userSchema);
