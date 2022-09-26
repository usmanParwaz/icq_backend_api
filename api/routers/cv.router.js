// importing required modules
const express = require(`express`);

// importing required middlewares
const {
  authenticateRequest,
} = require(`../middlewares/authentication.middleware`);
const { authorizeRequest } = require(`../middlewares/authorization.middleware`);
const { validateInput } = require(`../middlewares/input-validation.middleware`);

// importing required data validators
const {
  createCVSchema,
  specificCvSchema,
  allCvSchema,
  filteredCVsSchema,
  updateCVSchema,
} = require(`../../dependencies/input-validation-schemas/cv.schemas`);

// importing required controllers
const {
  createCV,
  fetchSpecificCV,
  getAllCVs,
  getFilteredCVs,
  updateCV,
  deleteCV,
} = require(`../controllers/cv.controller`);

// creating router
const cvRouter = express.Router();

// 1-> route to add a new system role in the database
cvRouter.post(
  `/`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(createCVSchema, `BODY`),
  createCV
);

// 1-> route to fetch a specific system role from database via _id
// 2-> route to fetch all system roles as an array from database
cvRouter.get(
  `/specific/:cvId`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(specificCvSchema, `PARAMS`),
  fetchSpecificCV
);

cvRouter.get(
  `/all`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(allCvSchema, `NONE`),
  getAllCVs
);

cvRouter.get(
  `/getFilteredCVs`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(filteredCVsSchema, `QUERY`),
  getFilteredCVs
);

// 1-> route to update a specific system role in the database via _id
cvRouter.patch(
  `/:cvId`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(specificCvSchema, `PARAMS`),
  validateInput(updateCVSchema, `BODY`),
  updateCV
);

// 1-> route to delete a specific systemRole from database via _id
cvRouter.delete(
  `/:cvId`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(specificCvSchema, `PARAMS`),
  deleteCV
);

// exporting router as a module
module.exports = {
  cvRouter,
};
