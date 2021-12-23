/**
 * Event schema
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const mongoose = require("mongoose");

const guestsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    guest_type: {
      type: String,
    },
    table_no: {
      type: Number,
    },
    total_guests: {
      type: Number,
    },
    participation: {
      type: String,
      enum: [coming, notcoming, maybe],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("guests", guestsSchema);
