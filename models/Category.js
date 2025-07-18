const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const categorySchema = new mongoose.Schema({
  categoryId: { type: String, unique: true },
  name:       { type: String, required: true, unique: true }
}, { timestamps: true });


categorySchema.pre("save", function (next) {
  if (!this.categoryId) {
    this.categoryId = "CAT-" + uuidv4().split("-")[0]; // example: CAT-3f5e
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);