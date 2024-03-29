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
  signupSchema,
  loginSchema,
  specificUserSchema,
  allUsersSchema,
  updateSpecificUserSchema,
  checkUserEmail,
  addOrRemoveCVsSchema,
} = require(`../../dependencies/input-validation-schemas/user.schemas`);

// importing required controllers
const {
  signupUser,
  loginUser,
  fetchSpecificUser,
  checkUserForEmail,
  getAllUsers,
  updateUser,
  addSelectedCVs,
  removeSelectedCVs,
  deleteSystemRole,
} = require(`../controllers/user.controller`);

// creating router
const userRouter = express.Router();

// 1-> route to add a new system role in the database
userRouter.post(
  `/signup`,
  authenticateRequest,
  authorizeRequest,
  validateInput(signupSchema, `BODY`),
  signupUser
);

// 1-> route to add a new system role in the database
userRouter.get(
  `/login`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(loginSchema, `QUERY`),
  loginUser
);

// 1-> route to fetch a specific system role from database via _id
// 2-> route to fetch all system roles as an array from database
userRouter.get(
  `/getUserById/:userId`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(specificUserSchema, `PARAMS`),
  fetchSpecificUser
);

// 1-> route to fetch a specific system role from database via _id
// 2-> route to fetch all system roles as an array from database
userRouter.get(
  `/getUserByEmail`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(checkUserEmail, `QUERY`),
  checkUserForEmail
);

userRouter.get(
  `/list`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(allUsersSchema, `QUERY`),
  getAllUsers
);

// 1-> route to update a specific system role in the database via _id
userRouter.patch(
  `/updateUser/:userId`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(specificUserSchema, `PARAMS`),
  validateInput(updateSpecificUserSchema, `BODY`),
  updateUser
);

// 1-> route to update a specific system role in the database via _id
userRouter.patch(
  `/addSelectedCVs/:userId`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(specificUserSchema, `PARAMS`),
  validateInput(addOrRemoveCVsSchema, `BODY`),
  addSelectedCVs
);

// 1-> route to update a specific system role in the database via _id
userRouter.patch(
  `/removeSelectedCVs/:userId`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(specificUserSchema, `PARAMS`),
  validateInput(addOrRemoveCVsSchema, `BODY`),
  removeSelectedCVs
);

// 1-> route to delete a specific systemRole from database via _id
userRouter.delete(
  `/:userId`,
  // authenticateRequest,
  // authorizeRequest,
  validateInput(specificUserSchema, `PARAMS`),
  deleteSystemRole
);

// exporting router as a module
module.exports = {
  userRouter,
};
