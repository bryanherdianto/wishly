const mongoose = require("mongoose")

const BirthdayCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  theme: {
    type: String,
    enum: ["pink", "blue", "purple", "gold", "rainbow"],
    default: "pink",
  },
  style: {
    type: String,
    enum: ["balloons", "confetti", ""],
    default: "",
  },
  music: {
    type: String,
    enum: ["yes", "no"],
    default: "no",
  },
  message: {
    type: String,
    trim: true,
  },
  photoUrl: {
    type: String,
    default: "",
  },
  showAge: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("BirthdayCard", BirthdayCardSchema)
