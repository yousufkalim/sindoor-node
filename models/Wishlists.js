/**
 * Event Wishlist schema
 * @author Najam Ul Saqib
 */
const mongoose = require("mongoose");

//Schema
const WishlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    paid: [
      {
        amount: Number,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("wishlists", WishlistSchema);
