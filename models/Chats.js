/**
 * Events schema
 * @author Najam Ul Saqib
 */

const mongoose = require("mongoose");

// Schema
const ChatSchema = new mongoose.Schema(
  {
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "serviceProviders",
    },
    users: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
    messages: [
      {
        text: String,
        from: String,
        date: {
          type: Date,
          default: new Date(),
        },
        seen: {
          type: String,
          enum: ["sent", "received", "seen"],
          default: "sent",
        },
      },
    ],
    last: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("chats", ChatSchema);
