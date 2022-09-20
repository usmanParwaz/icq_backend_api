// importing required packages and modules
const { logInfo, logError } = require(`../../dependencies/helpers/console.helpers`);

// importing required config params
const { HTTP_STATUS_CODES: { UNAUTHORIZED, FORBIDDEN, SERVER_ERROR } } = require(`../../dependencies/config`);

// importing required system permissions map
const { systemPermissionsMap } = require(`../../dependencies/system-permissions.map`);



// this middleware grants or rejects authorization to incoming request
// for a resource on the basis of assigned system permissions in its
// access token
const authorizeRequest = async (req, res, next) => {

  try {

    // fetching required data from incoming request
    const { method, originalUrl, tokenData: { bearerPermissions, accountStatus } } = req;

    // checking accountStatus for token bearer
    if (accountStatus.toUpperCase() === `DISABLED`) {
      // this code runs in case the bearer's account is DISABLED

      // logging error message to the console
      logError(`Authorization failed. Bearer's account disabled by System Admin.`);

      // returning the response with an error message
      return res.status(FORBIDDEN).json({

        hasError: true,
        message: `ERROR: Requested Operation Failed.`,
        error: {

          error: `Authorization failed. Bearer's account disabled by System Admin.`

        }

      });

    }

    // parsing the original request url as required to fetch permission mapping
    const urlFragments = originalUrl.split(`/`)

    const parsedUrlFragments = [];

    for (const fragment of urlFragments) {

      // calling helper to validate current entry
      const { status, data, error } = await isValidObjectId(fragment);

      // checking for an error
      if (error) {
        // this code runs in case an error was returned from helper

        // throwing an exception
        throw (`An unhandled exception occured while parsing request url.`);

      }

      const result = data ? `*` : fragment;

      // returning result
      parsedUrlFragments.push(result);

    }

    const parsedUrl = parsedUrlFragments.join(`/`);

    // fetching required system permissions for the requested system resource
    const requiredSystemPermissions = systemPermissionsMap.get(`${method.toUpperCase()} ${parsedUrl}`);

    // checking if bearer has required system permissions to proceed
    const isBearerAuthorized = requiredSystemPermissions.some(permission => bearerPermissions.includes(permission));

    // checking if the bearer is authorized or not
    if (!isBearerAuthorized) {
      // this code runs in case bearer is not authorized to access
      // the requested resource

      // logging error message to the console
      logError(`Access Denied. Bearer not authorized to access this resource.`);

      // returning the response with an error message
      return res.status(FORBIDDEN).json({

        hasError: true,
        message: `ERROR: Requested Operation Failed.`,
        error: {

          error: `Access Denied. Bearer not authorized to access this resource.`

        }

      });

    }

    // forwarding request to the next handler
    next();

  } catch (error) {
    // this code runs in case of an ERROR @ runtime

    // logging error messages to the console
    logError(`ERROR @ authorizeRequest -> authorization.middleware.js`, error);

    // returning the response with an error message
    return res.status(SERVER_ERROR).json({

      hasError: true,
      message: `ERROR: Requested Operation Failed.`,
      error: {

        error

      }

    });

  }

}



// exporting as a module
module.exports = {

  authorizeRequest

};