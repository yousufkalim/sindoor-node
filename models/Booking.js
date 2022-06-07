/**
 * Booking schema
 * @author Najam Ul Saqib
 */

// Init
const { Schema, model } = require("mongoose");

// Admin Schema
const bookingSchema = new Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "serviceProviders",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "refused"],
      default: "pending",
    },
    price: {
      type: Number,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    start_date: Date,
    end_date: Date,
    duration: Number, // minutes
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = model("bookings", bookingSchema);
