// importing required packages and modules
const { logInfo, logError } = require(`../../dependencies/helpers/console.helpers`);

// importing required config params
const { HTTP_STATUS_CODES: { BAD_REQUEST }, ALLOWED_VALIDATION_SCHEMA_SCOPES: { BODY, PARAMS, NONE } } = require(`../../dependencies/config`);



// this middleware takes in input schema and schema scope (body,
// params) and returns a validation function which validates the
// schema upon invocation
const validateInput = (inputSchema, schemaScope) => {

  // defining a method to validate incoming request body data
  const requestBodyValidator = async (req, res, next) => {

    try {

      // validating incoming request body
      if (!Object.keys(req.body).length) {
        // this code runs in case incoming request body is empty

        // logging error message to the console
        logError(`Incoming request body can't be empty.`);

        // returning the response with an error message
        return res.status(BAD_REQUEST).json({

          hasError: true,
          message: `ERROR: Data Validation Failed.`,
          error: {

            error: `Incoming request body can't be empty.`

          }

        });

      }

      // validating the incoming schema
      const validationResult = await inputSchema.validateAsync(req.body, { abortEarly: false });

      // forwarding the request to the next handler
      next();

    } catch (error) {
      // this code runs in case the incoming data's validation
      // fails against the defined schema

      // consrtucting string describing data validation errors
      const errorDescription = (error.details.map((entry, i) => `${i + 1}-> ${entry.message}`));

      // logging error messages to the console
      logError(`Data Validation Failed.`);
      logError(`${errorDescription}.`);

      // returning the response with an error message
      return res.status(BAD_REQUEST).json({

        hasError: true,
        message: `ERROR: Data Validation Failed.`,
        error: {

          errors: errorDescription

        }

      });
    }

  }

  // defining a method to validate path params of url for incoming request
  const requestPathParamsValidator = async (req, res, next) => {

    try {

      // validating incoming request's path params
      if (!Object.keys(req.params).length) {
        // this code runs in case incoming request's path params is empty

        // logging error message to the console
        logError(`Incoming request path params can't be empty.`);

        // returning the response with an error message
        return res.status(BAD_REQUEST).json({

          hasError: true,
          message: `ERROR: Data Validation Failed.`,
          error: {

            error: `Incoming request path params can't be empty.`

          }

        });

      }

      // validating the incoming schema
      const validationResult = await inputSchema.validateAsync(req.params, { abortEarly: false });

      // forwarding the request to the next handler
      next();

    } catch (error) {
      // this code runs in case the incoming data's validation
      // fails against the defined schema

      // consrtucting string describing data validation errors
      const errorDescription = (error.details.map((entry, i) => `${i + 1}-> ${entry.message}`));

      // logging error messages to the console
      logError(`Data Validation Failed.`);
      logError(`${errorDescription}.`);

      // returning the response with an error message
      return res.status(BAD_REQUEST).json({

        hasError: true,
        message: `ERROR: Data Validation Failed.`,
        error: {

          errors: errorDescription

        }

      });
    }

  }

  // defining a method to let the request pass without any validation
  const requestDummyValidator = async (req, res, next) => {

    // forwarding the request to the next handler
    next();

  }

  // returning the function upon invocation by the router
  return schemaScope === BODY ? requestBodyValidator : schemaScope === PARAMS ? requestPathParamsValidator : requestDummyValidator;

}



// exporting as a module
module.exports = {

  validateInput

};