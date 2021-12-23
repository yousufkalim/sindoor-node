/**
 * Album Schema
 * @author Yousuf Kaleem
 * @codeBy Shuja Naqvi
 */
const mongoose = require("mongoose");
const albumSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "events",
  },
  album: {
    album_info: {
      photos: Array,
      sendBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  },
});
module.exports = mongoose.model("albums", albumSchema);
