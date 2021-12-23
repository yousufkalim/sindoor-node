/**
 * company Schema
 * @author Yousuf kaleem
 * @codeby Shuja Naqvi
 */
const mongoose = require("mongoose");

const service_providerSchema = new mongoose.Schema({
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
  company_name: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  fcmToken: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ServiceProvider"],
  },
  services: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "services",
  },
  photo: String,
});
module.exports = mongoose.model("service_providers", service_providerSchema);
