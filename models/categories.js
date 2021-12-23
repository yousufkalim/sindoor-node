/**
 * Services schema
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoriesSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("categories", categoriesSchema);
