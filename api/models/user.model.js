// importing required modules
const mongoose = require(`mongoose`);

// defining system role schema
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    firstName: {
      type: String,
      trim: true,
      default: null,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: null,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      default: null,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      default: null,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: null,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// exporting schema model as a module
module.exports = mongoose.model('User', userSchema, `User`);