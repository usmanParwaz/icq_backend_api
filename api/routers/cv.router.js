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
  loginSchema,
  allSystemRolesSchema,
  specificSystemRoleSchema,
  updateSpecificSystemRoleSchema,
} = require(`../../dependencies/input-validation-schemas/cv.schemas`);

// importing required controllers
const {
  createCV,
  loginUser,
  getAllSystemRoles,
  fetchSpecificSystemRole,
  updateSystemRole,
  deleteSystemRole,
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

// 1-> route to add a new system role in the database
cvRouter.post(
  `/login`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(loginSchema, `BODY`),
  loginUser
);

// 1-> route to fetch a specific system role from database via _id
// 2-> route to fetch all system roles as an array from database
cvRouter.get(
  `/:systemRoleId`,
  authenticateRequest,
  authorizeRequest,
  validateInput(specificSystemRoleSchema, `PARAMS`),
  fetchSpecificSystemRole
);

cvRouter.get(
  `/`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(allSystemRolesSchema, `NONE`),
  getAllSystemRoles
);

// 1-> route to update a specific system role in the database via _id
cvRouter.patch(
  `/:systemRoleId`,
  authenticateRequest,
  authorizeRequest,
  validateInput(specificSystemRoleSchema, `PARAMS`),
  validateInput(updateSpecificSystemRoleSchema, `BODY`),
  updateSystemRole
);

// 1-> route to delete a specific systemRole from database via _id
cvRouter.delete(
  `/:systemRoleId`,
  authenticateRequest,
  authorizeRequest,
  validateInput(specificSystemRoleSchema, `PARAMS`),
  deleteSystemRole
);

// exporting router as a module
module.exports = {
  cvRouter,
};
