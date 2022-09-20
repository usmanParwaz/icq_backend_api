// importing required packages and modules
const cors = require(`cors`);
const express = require(`express`);
const morgan = require(`morgan`);
const {
  logSuccess,
  logInfo,
  logWarning,
  logError,
} = require(`./dependencies/helpers/console.helpers`);
const {
  connectDatabase,
  disconnectDatabase,
} = require(`./dependencies/helpers/database.helpers`);

// importing required config params
const {
  APP_MODE,
  NODE_PORT,
  MAX_FILE_SIZE_ALLOWED_BYTES,
  HTTP_STATUS_CODES: { SUCCESS },
} = require(`./dependencies/config`);

// importing required routers
const { userRouter } = require(`./api/routers/user.router`);
const { cvRouter } = require(`./api/routers/cv.router`);
// REMIANING ROUTERS GO HERE

// creating an instance of express server
const server = express();

// initializing server
(async () => {
  try {
    // Listening requests on the specified PORT
    server.listen(
      NODE_PORT,
      logInfo(`Initializing server in ${APP_MODE} mode. Please wait.`)
    );

    // declaring globals
    global.CONNECTED_CLIENTS = {};

    // 1-> middleware for handling cors
    // 2-> middleware to log requests to the console
    // 3-> middleware to parse json request body
    // 4-> middleware to parse urlencoded request data
    server.use(cors());
    server.use(morgan(`dev`));
    server.use(
      express.json({
        limit: MAX_FILE_SIZE_ALLOWED_BYTES,
        verify: (req, res, buf) => (req.rawBody = buf),
      })
    );
    server.use(express.urlencoded({ extended: false }));

    // api handlers
    server.use(`/api/users`, userRouter); // validation done
    server.use(`/api/cv`, cvRouter); // validation done
    // LIST OF API HANDLERS GO HERE

    // creating test route
    server.get(`/`, (req, res, next) =>
      res
        .status(SUCCESS)
        .send(`|| Service is UP & RUNNING in ${APP_MODE} mode ||`)
    );

    // making connection to database
    await connectDatabase();

    // logging message to the console
    logInfo(`Server is running @ port ${NODE_PORT}.`);
  } catch (error) {
    // this code runs in case of an ERROR @ runtime

    // logging error message to the console
    logError(`ERROR @ Server Initialization Process.`, error);
  }
})();

// disconnecting from the database instance before killing
// the process
process.on(`SIGINT`, async () => {
  // disconnecting server from database
  await disconnectDatabase();
});
