// importing required packages and modules
const {
  logWarning,
  logError,
} = require(`../../dependencies/helpers/console.helpers`);

// importing required data services
const {
  signup,
  login,
  findUserById,
  findAllUsers,
  findUserByIdAndUpdate,
  findUserByIdAndAddCV,
  findUserByIdAndRemoveCV,
  findUserByEmail,
} = require(`../../dependencies/internal-services/user.services`);

// importing response status codes
const {
  HTTP_STATUS_CODES: {
    SUCCESS,
    CREATED,
    BAD_REQUEST,
    NOT_FOUND,
    CONFLICT,
    SERVER_ERROR,
  },
} = require(`../../dependencies/config`);
const userModel = require("../models/user.model");

// this controller takes data via incoming request body and creates a new system
// role in the database.
const signupUser = async (req, res, next) => {
  try {
    // fetching required data via incoming token data
    // const { firstName, lastName, email, password, phoneNumber, address, role } = req.body;

    const { getUserByEmailStatus, userFound } = await findUserByEmail(
      req.body.email
    );

    if (getUserByEmailStatus == SUCCESS && userFound) {
      return res.status(CONFLICT).json({
        hasError: false,
        message: `Email Already Exists`,
      });
    }

    // calling data service to save new system role in the database
    const { status, data, error } = await signup(req.body);

    // checking the result of the operation
    if (status === SERVER_ERROR) {
      // this code runs in case data service failed due to
      // unknown database error

      // logging error message to the console
      logError(`Requested operation failed. Unknown database error.`);

      // returning the response with an error message
      return res.status(SERVER_ERROR).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    } else if (status === CONFLICT) {
      // this code runs in case data service failed due to
      // duplication value

      // logging error message to the console
      logError(
        `Requested operation failed. System role with duplicate field(s) exists.`
      );

      // returning the response with an error message
      return res.status(CONFLICT).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    }

    // returning the response with success message
    return res.status(CREATED).json({
      hasError: false,
      message: `SUCCESS: User Created`,
      data,
    });
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(`ERROR @ addSystemRole -> system-role.controllers.js`, error);

    // returning response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested operation failed.`,
      error: {
        error: `An unhandled exception occured on the server.`,
      },
    });
  }
};

// this controller takes data via incoming request body and creates a new system
// role in the database.
const loginUser = async (req, res, next) => {
  try {
    // calling data service to save new system role in the database
    const { status, data, error } = await login(req.query);

    // checking the result of the operation
    if (status === SERVER_ERROR) {
      // this code runs in case data service failed due to
      // unknown database error

      // logging error message to the console
      logError(`Requested operation failed. Unknown database error.`);

      // returning the response with an error message
      return res.status(SERVER_ERROR).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    } else if (status === CONFLICT) {
      // this code runs in case data service failed due to
      // duplication value

      // logging error message to the console
      logError(
        `Requested operation failed. System role with duplicate field(s) exists.`
      );

      // returning the response with an error message
      return res.status(CONFLICT).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    } else if (status === NOT_FOUND) {
      // this code runs in case data service failed due to
      // duplication value

      // logging error message to the console
      logError(`Requested operation failed. User not Found.`);

      // returning the response with an error message
      return res.status(NOT_FOUND).json({
        hasError: false,
        message: `ERROR: User Not Found.`,
      });
    }

    // returning the response with success message
    return res.status(CREATED).json({
      hasError: false,
      message: `SUCCESS: Logged In`,
      data,
    });
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(`ERROR @ addSystemRole -> system-role.controllers.js`, error);

    // returning response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested operation failed.`,
      error: {
        error: `An unhandled exception occured on the server.`,
      },
    });
  }
};

// this controller takes in system role id via path params of url, searches
// database for the requested system role and returns it
const fetchSpecificUser = async (req, res, next) => {
  try {
    // fetching required data via path params of url
    const { userId } = req.params;

    // calling data service to fetching requested system role from database
    const { status, data, error } = await findUserById(userId);

    // checking the result of the operation
    if (status === SERVER_ERROR) {
      // this code runs in case data service failed due to
      // unknown database error

      // logging error message to the console
      logError(`Requested operation failed. Unknown database error.`);

      // returning the response with an error message
      return res.status(SERVER_ERROR).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    } else if (status === NOT_FOUND) {
      // this code runs in case data service could not find
      // the requested resource

      // logging error message to the console
      logError(`Requested operation failed. System Role not found.`);

      // returning the response with an error message
      return res.status(NOT_FOUND).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    }

    // returning the response with success message
    return res.status(SUCCESS).json({
      hasError: false,
      message: `SUCCESS: Requested operation successful.`,
      data,
    });
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(
      `ERROR @ fetchSpecificSystemRole -> system-role.controllers.js`,
      error
    );

    // returning the response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested operation failed.`,
      error: {
        error: `An unexpected error occurred on the server.`,
      },
    });
  }
};

// this controller takes in system role id via path params of url, searches
// database for the requested system role and returns it
const checkUserForEmail = async (req, res, next) => {
  try {
    // fetching required data via path params of url
    const { email } = req.query;

    // calling data service to fetching requested system role from database
    const { getUserByEmailStatus, userFound, error } = await findUserByEmail(
      email
    );

    // checking the result of the operation
    if (getUserByEmailStatus === SERVER_ERROR) {
      // this code runs in case data service failed due to
      // unknown database error

      // logging error message to the console
      logError(`Requested operation failed. Unknown database error.`);

      // returning the response with an error message
      return res.status(SERVER_ERROR).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    } else if (getUserByEmailStatus === SUCCESS) {
      // this code runs in case data service could not find
      // the requested resource

      // returning the response with an error message
      return res.status(CONFLICT).json({
        hasError: false,
        message: `Email Aalready Exists`,
      });
    }

    if (getUserByEmailStatus == NOT_FOUND) {
      // returning the response with success message
      return res.status(SUCCESS).json({
        hasError: false,
        message: `SUCCESS: Available.`,
      });
    }
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(
      `ERROR @ fetchSpecificSystemRole -> system-role.controllers.js`,
      error
    );

    // returning the response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested operation failed.`,
      error: {
        error: `An unexpected error occurred on the server.`,
      },
    });
  }
};

// this controller returns all system roles stored in the database as
// an array
const getAllUsers = async (req, res, next) => {
  try {
    // calling data service to fetch all system roles from database
    const { status, pager, data, error } = await findAllUsers(req.query);

    // checking the result of the operation
    if (status === SERVER_ERROR) {
      // this code runs in case data service failed due to
      // unknown database error

      // logging error message to the console
      logError(`Requested operation failed. Unknown database error.`);

      // returning the response with an error message
      return res.status(SERVER_ERROR).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    }

    // returning the response with success message
    return res.status(SUCCESS).json({
      hasError: false,
      message: `SUCCESS: Users Fetched`,
      pager: pager,
      data,
    });
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(`ERROR @ getAllSystemRoles -> system-role.controllers.js`, error);

    // returning the response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested operation failed.`,
      error: {
        error: `An unexpected error occurred on the server.`,
      },
    });
  }
};

// this controller takes in system role id via path params of url, searches
// database for the requested system role and updates it
const updateUser = async (req, res, next) => {
  try {
    // fetching required data via incoming path params of url
    const { userId } = req.params;

    // calling data service to update requested system role in the database
    const { status, data, error } = await findUserByIdAndUpdate(
      userId,
      req.body
      // req.tokenData,
    );

    // checking the result of the operation
    if (status === SERVER_ERROR) {
      // this code runs in case data service failed due to
      // unknown database error

      // logging error message to the console
      logError(`Requested operation failed. Unknown database error.`);

      // returning the response with an error message
      return res.status(SERVER_ERROR).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    } else if (status === NOT_FOUND) {
      // this code runs in case data service could not find
      // the requested resource

      // logging error message to the console
      logError(`Requested operation failed. System role not found.`);

      // returning the response with an error message
      return res.status(NOT_FOUND).json({
        hasError: true,
        message: `ERROR: Requested operation failed. System role not found.`,
        error: {
          error,
        },
      });
    }

    // returning the response with success message
    return res.status(SUCCESS).json({
      hasError: false,
      message: `SUCCESS: Requested operation successful.`,
      data,
    });
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(`ERROR @ updateSystemRole -> system-role.controllers.js`, error);

    // returning the response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested operation failed.`,
      error: {
        error: `An unexpected error occurred on the server.`,
      },
    });
  }
};

// this controller takes in system role id via path params of url, searches
// database for the requested system role and updates it
const addSelectedCVs = async (req, res, next) => {
  try {
    // fetching required data via incoming path params of url
    const { userId } = req.params;

    // calling data service to update requested system role in the database
    const { status, data, error } = await findUserByIdAndAddCV(
      userId,
      req.body
      // req.tokenData,
    );

    // checking the result of the operation
    if (status === SERVER_ERROR) {
      // this code runs in case data service failed due to
      // unknown database error

      // logging error message to the console
      logError(`Requested operation failed. Unknown database error.`);

      // returning the response with an error message
      return res.status(SERVER_ERROR).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    } else if (status === NOT_FOUND) {
      // this code runs in case data service could not find
      // the requested resource

      // logging error message to the console
      logError(`Requested operation failed. System role not found.`);

      // returning the response with an error message
      return res.status(NOT_FOUND).json({
        hasError: true,
        message: `ERROR: Requested operation failed. System role not found.`,
        error: {
          error,
        },
      });
    }

    // returning the response with success message
    return res.status(SUCCESS).json({
      hasError: false,
      message: `SUCCESS: Requested operation successful.`,
      data,
    });
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(`ERROR @ updateSystemRole -> system-role.controllers.js`, error);

    // returning the response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested operation failed.`,
      error: {
        error: `An unexpected error occurred on the server.`,
      },
    });
  }
};

// this controller takes in system role id via path params of url, searches
// database for the requested system role and updates it
const removeSelectedCVs = async (req, res, next) => {
  try {
    // fetching required data via incoming path params of url
    const { userId } = req.params;

    // calling data service to update requested system role in the database
    const { status, data, error } = await findUserByIdAndRemoveCV(
      userId,
      req.body
      // req.tokenData,
    );

    // checking the result of the operation
    if (status === SERVER_ERROR) {
      // this code runs in case data service failed due to
      // unknown database error

      // logging error message to the console
      logError(`Requested operation failed. Unknown database error.`);

      // returning the response with an error message
      return res.status(SERVER_ERROR).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    } else if (status === NOT_FOUND) {
      // this code runs in case data service could not find
      // the requested resource

      // logging error message to the console
      logError(`Requested operation failed. System role not found.`);

      // returning the response with an error message
      return res.status(NOT_FOUND).json({
        hasError: true,
        message: `ERROR: Requested operation failed. System role not found.`,
        error: {
          error,
        },
      });
    }

    // returning the response with success message
    return res.status(SUCCESS).json({
      hasError: false,
      message: `SUCCESS: Requested operation successful.`,
      data,
    });
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(`ERROR @ updateSystemRole -> system-role.controllers.js`, error);

    // returning the response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested operation failed.`,
      error: {
        error: `An unexpected error occurred on the server.`,
      },
    });
  }
};

// this controller takes in system role id via path params of url, searches
// database for the requested system role and removes it (sets isDeleted to true)
const deleteSystemRole = async (req, res, next) => {
  try {
    // fetching required data via incoming path params of url
    const { userId } = req.params;

    // creating update data obj to pass to the data service
    const updateObj = {
      isDeleted: true,
    };

    // calling data service to update requested system role in the database
    const { status, data, error } = await findUserByIdAndUpdate(
      userId,
      updateObj,
      req.tokenData
    );

    // checking the result of the operation
    if (status === SERVER_ERROR) {
      // this code runs in case data service failed due to
      // unknown database error

      // logging error message to the console
      logError(`Requested operation failed. Unknown database error.`);

      // returning the response with an error message
      return res.status(SERVER_ERROR).json({
        hasError: true,
        message: `ERROR: Requested operation failed.`,
        error: {
          error,
        },
      });
    } else if (status === NOT_FOUND) {
      // this code runs in case data service could not find
      // the requested resource

      // logging error message to the console
      logError(`Requested operation failed. System role not found.`);

      // returning the response with an error message
      return res.status(NOT_FOUND).json({
        hasError: true,
        message: `ERROR: Requested operation failed. System role not found.`,
        error: {
          error,
        },
      });
    }

    // returning the response with success message
    return res.status(SUCCESS).json({
      hasError: false,
      message: `SUCCESS: Requested operation successful.`,
      data: {
        systemRole: systemRoleId,
      },
    });
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(`ERROR @ deleteSystemRole -> system-role.controllers.js`, error);

    // returning the response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested operation failed.`,
      error: {
        error: `An unexpected error occurred on the server.`,
      },
    });
  }
};

// exporting controllers as modules
module.exports = {
  signupUser,
  loginUser,
  fetchSpecificUser,
  checkUserForEmail,
  getAllUsers,
  updateUser,
  addSelectedCVs,
  removeSelectedCVs,
  deleteSystemRole,
};
