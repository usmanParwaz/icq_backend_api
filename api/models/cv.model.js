// importing required modules
const mongoose = require(`mongoose`);

// Personal Information
const personalInfo = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  postalAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
},
{
    _id: false
});

// Educational Information
const educationInfo = new mongoose.Schema({
  institute: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
},
{
    _id: false
});

// Experience
const experience = new mongoose.Schema({
  designation: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    required: true,
  },
  currentStatus: {
    type: String,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
  },
},
{
    _id: false
});

const cvSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  workerType: {
    type: String,
    required: true,
    enum: ['GARDNER', 'CLEANER', 'SWEAPER', 'GUARD'],
  },
  experience: {
    type: String,
    trim: true,
    required: true,
  },
  cvUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // personalInformation: {
  //   type: [personalInfo],
  //   required: true,
  // },
  // educationInformation: {
  //   type: [educationInfo],
  //   required: true,
  // },
  // experience: {
  //   type: [experience],
  //   required: true,
  // },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},
{
    timestamps: true,
});

// cvSchema.pre('validate', async function () {});

module.exports = mongoose.model('CVs', cvSchema, 'Cv');
