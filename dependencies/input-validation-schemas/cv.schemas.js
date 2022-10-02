// importing required packages and modules
const Joi = require(`joi`);

// importing required custom data validators
const { objectIdValidation } = require(`../helpers/joi.helpers`);



// defining validation schema for adding a new system role
const createCVSchema = Joi.object({

  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  workerType: Joi.string().required(),
  cvPdf: Joi.string().required(),
  cvPdfName: Joi.string().required(),
  price: Joi.string().required(),
  userId: Joi.string().required(),

});

// defining validation schema for fetching a specific system role
const specificCvSchema = Joi.object({
  
  cvId: Joi.string().custom(objectIdValidation, `CV ID Validation`).required()
  
});

// defining validation schema for fetching all system roles
const allCvSchema = null;

// defining validation schema for adding a new system role
const filteredCVsSchema = Joi.object({

  page: Joi.string().required(),
  recordsPerPage: Joi.string().required(),
  sort: Joi.string().required(),
  filters: Joi.string().required(),

});

// defining validation schema for updating a specific system role
const updateCVSchema = Joi.object({

  firstName: Joi.string(),
  lastName: Joi.string(),
  price: Joi.string(),

});



// exporting as modules
module.exports = {

  createCVSchema,
  specificCvSchema,
  allCvSchema,
  filteredCVsSchema,
  updateCVSchema

};