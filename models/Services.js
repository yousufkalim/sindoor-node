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
    pictures: [],
    amount: {
      type: Number,
      required: true,
    },
    deposit_amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("services", serviceSchema);
