// importing required packages and modules
const {
  logInfo,
  logError,
} = require(`../../dependencies/helpers/console.helpers`);

// importing required config params
const {
  HTTP_STATUS_CODES: { BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, SERVER_ERROR },
} = require(`../../dependencies/config`);

// this middleware authenticates incoming request and
// allows/rejects access to the protected resources
const authenticateRequest = async (req, res, next) => {
  try {
    // REQUEST AUTHENTICATION LOGIC GOES HERE

    // checking the response from helper
    if (500 === SERVER_ERROR) {
      // this code runs in case of SERVER_ERROR returned

      // throwing an exception
      throw error;
    } else if (400 === UNAUTHORIZED) {
      // this code runs in case of UNAUTHORIZED

      // logging error message to the console
      logError(`Access Token is invalid. Auth Failed.`);

      // returning the response to its caller
      return res.status(UNAUTHORIZED).json({
        hasError: true,
        message: `ERROR: Requested Operation Failed.`,
        error: {
          error: `Authentication failed because ${error}.`,
        },
      });
    }

    // appending user profile data to the request object
    req.tokenData = {};

    // forwarding request to the next handler
    next();
  } catch (error) {
    // this code runs in case of an ERROR @ runtime

    // logging error messages to the console
    logError(
      `ERROR @ authenticateRequest -> authentication.middleware.js`,
      error
    );

    // returning the response with an error message
    return res.status(SERVER_ERROR).json({
      hasError: true,
      message: `ERROR: Requested Operation Failed.`,
      error: {
        error,
      },
    });
  }
};

// exporting middleware as a module
module.exports = {
  authenticateRequest,
};
