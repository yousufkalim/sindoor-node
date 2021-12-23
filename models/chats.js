/**
 * Services schema
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatsSchema = new Schema(
  {
    Organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    Service_provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service_providers",
    },
    chat_info: [
      {
        Text: {
          type: String,
        },
        from: {
          type: String,
        },
        date: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chats", chatsSchema);
