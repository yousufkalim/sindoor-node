/**
 * App Picture schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

//Schema
const AppPictureSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('appPicture', AppPictureSchema);
