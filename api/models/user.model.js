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
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
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
      required: true,
    },
    _orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
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
