// importing required packages and modules
const Joi = require(`joi`);

// importing required custom data validators
const { objectIdValidation } = require(`../helpers/joi.helpers`);



// defining validation schema for adding a new system role
const createCVSchema = Joi.object({

  userImage: Joi.string().required(),
  role: Joi.string().required(),
  personalInformation: Joi.array().items(
        {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          email: Joi.string().required(),
          cnic: Joi.string().required(),
          phoneNumber: Joi.string().required(),
          postalAddress: Joi.string().required(),
          city: Joi.string().required()
        }
  ).required(),
  educationInformation: Joi.array().items(
      {
          institute: Joi.string().required(),
          degree: Joi.string().required(),
          startDate: Joi.string().required(),
          endDate: Joi.string().required()
      }
  ).required(),
  experience: Joi.array().items(
      {
          designation: Joi.string().required(),
          company: Joi.string().required(),
          location: Joi.string().required(),
          employmentType: Joi.string().required(),
          currentStatus: Joi.string().required(),
          startDate: Joi.string().required(),
          endDate: Joi.string()
      }
  ).required()

});

// defining validation schema for adding a new system role
const loginSchema = Joi.object({

  email: Joi.string().required(),
  password: Joi.string().required(),

});

// defining validation schema for fetching all system roles
const allSystemRolesSchema = null;

// defining validation schema for fetching a specific system role
const specificSystemRoleSchema = Joi.object({

  systemRoleId: Joi.string().custom(objectIdValidation, `System Role ID Validation`).required()

});

// defining validation schema for updating a specific system role
const updateSpecificSystemRoleSchema = Joi.object({

  name: Joi.string().min(1).required(),
  description: Joi.string().min(1),
  permissions: Joi.array().items(Joi.string().min(3)).required()

});



// exporting as modules
module.exports = {

  createCVSchema,
  loginSchema,
  allSystemRolesSchema,
  specificSystemRoleSchema,
  updateSpecificSystemRoleSchema

};