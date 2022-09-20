// importing required packages and modules
const mongoose = require('mongoose');
const { logSuccess, logInfo, logError } = require('./console.helpers');

// importing required config dependencies
const { MONGO_ATLAS_CONNECTION_URI } = require('../../dependencies/config');



// this helper connects to the instance of MongoDB Atlas
// database in the cloud
const connectDatabase = async () => {

  try {

    // setting config params in an object which will be passed
    // as a param to the connect function
    const connectionConfig = {

      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false

    };

    // making connection to the database
    await mongoose.connect(MONGO_ATLAS_CONNECTION_URI, connectionConfig);

    // logging success messsage to the console
    logSuccess(`Database connection successful.`);


  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging the error messages to the console
    logError(`ERROR @ connectDatabase -> database.helpers.js`, error);

    // exiting the current node process
    process.exit(1);

  }

}

// this helper disconnects the instance of MongoDB Atlas
// database in the cloud
const disconnectDatabase = async () => {

  try {

    // closing the active mongoose connection to mongo db
    await mongoose.connection.close();

    // logging message to the console
    logInfo(`Connection to database closed.`);

    // killing the current process
    process.exit();

  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(`ERROR @ disconnectDatabase -> database.helpers.js`, error);

  }

}



// exporting helpers as module
module.exports = {

  connectDatabase,
  disconnectDatabase

};