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
      type: Schema.Types.ObjectId,
      ref: "services",
    },
    serviceProvider: {
      type: Schema.Types.ObjectId,
      ref: "serviceProviders",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "events",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    final_price: Number,
    deposit_price: Number,
    paid: {
      type: String,
      enum: ["paid", "deposit", "nill"],
      default: "nill",
    },
    payment_history: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        amount: Number,
        date: Date,
      },
    ],
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
