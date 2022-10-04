// importing required packages and modules
const { required } = require("joi");
const Joi = require(`joi`);

// importing required custom data validators
const { objectIdValidation } = require(`../helpers/joi.helpers`);

// defining validation schema for adding a new system role
const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  role: Joi.string().required(),
});

// defining validation schema for adding a new system role
const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

// defining validation schema for fetching a specific system role
const specificUserSchema = Joi.object({
  userId: Joi.string()
    .custom(objectIdValidation, `User ID Validation`)
    .required(),
});

// defining validation schema for fetching a specific system role
const checkUserEmail = Joi.object({
  email: Joi.string().required(),
});

// defining validation schema for fetching all system roles
const allUsersSchema = Joi.object({
  page: Joi.number().required(),
  recordsPerPage: Joi.number().required(),
  sort: Joi.string().required(),
  filters: Joi.object({
    fisrtName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    phoneNumber: Joi.string(),
    address: Joi.string(),
    role: Joi.string().required(),
  }).required(),
});

// defining validation schema for updating a specific system role
const updateSpecificUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.string(),
  address: Joi.string(),
});

// defining validation schema for updating a specific system role
const addOrRemoveCVsSchema = Joi.object({
  cvId: Joi.string().custom(objectIdValidation, `CV ID Validation`).required(),
});

// exporting as modules
module.exports = {
  signupSchema,
  loginSchema,
  specificUserSchema,
  allUsersSchema,
  updateSpecificUserSchema,
  checkUserEmail,
  addOrRemoveCVsSchema,
};
