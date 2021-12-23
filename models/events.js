/**
 * Event schema
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const eventSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
    },
    event_type: {
      type: String,
    },
    description: {
      type: String,
    },
    event_pic: {
      type: String,
    },
    event_code: {
      type: String,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    co_organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    services: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
    },
    guests: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "guests",
    },
    bookings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "requests",
    },
    invoices: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoices",
    },
    location: {
      lat: String,
      lng: String,
      label1: String,
      label2: String,
      city: String,
      postal_code: String,
    },
    date: {
      type: Date,
    },
    tables:{
        required_tables:String,
        required_chairs:String
    },
    tables_info:{
        table:{
            table_no:String,
            guest_list:Array
        }
    },
    event_duration:{
        start_time:Date,
        end_time:Date
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("events", eventSchema);
