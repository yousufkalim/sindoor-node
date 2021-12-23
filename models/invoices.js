/**
 *   Invoices Schema
 * @author Yousuf Kaleem
 * @codeby Shuja Naqvi
 */
const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "events",
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "requests",
  },
  issue_date: {
    type: Date,
  },
  price: {
    type: Number,
  },
  status: {
    type: String,
    enum: [paid, pending, cancelled],
  },
});

module.exports = mongoose.model("invoices", invoiceSchema);
