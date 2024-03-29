// importing required packages and modules
const mongoose = require(`mongoose`);
const { logWarning, logError } = require(`../helpers/console.helpers`);

// importing required config params
const {
  HTTP_STATUS_CODES: {
    SUCCESS,
    CREATED,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    CONFLICT,
    SERVER_ERROR,
  },
} = require(`../config`);

// requiring required schemas
const User = require(`../../api/models/user.model`);

// this data service takes in system permission data obj and _creator, saves system
// role in the local database and returns response to its caller
const signup = async (userData) => {
  try {
    const userData = 0;
    // creating an object to store new system permission
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      ...userData,
    });

    console.log("user", user);

    // saving new system permission in the database
    const result = await user.save();

    // returning saved system permission to its caller
    return {
      status: CREATED,
      data: result,
    };
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(
      `ERROR @ saveSystemPermission -> system-permission.services.js`,
      error
    );

    // checking if the error stems from duplicate value in database
    const isDuplicateError = error && error.code === 11000;

    // fetching fields which caused duplication error
    const duplicateErrorFields = Object.keys(error.keyValue).join(`, `);

    // setting value of status and description
    const [status, err] = [
      isDuplicateError ? CONFLICT : SERVER_ERROR,
      isDuplicateError
        ? `System permission creation failed due to duplicate ${duplicateErrorFields}.`
        : `System permission creation failed.`,
    ];

    // returning response to indicate failure to its caller
    return {
      status,
      error: err,
    };
  }
};

// this data service takes in system permission data obj and _creator, saves system
// role in the local database and returns response to its caller
const login = async (userData) => {
  try {
    const { email, password } = userData;
    console.log(email, password);

    // creating an object to store new system permission
    const result = await User.findOne({ email: email, password: password });
    console.log("user", result);

    if (!result) {
      return {
        status: NOT_FOUND,
        message: "USER NOT FOUND",
      };
    }

    // returning saved system permission to its caller
    return {
      status: SUCCESS,
      data: result,
    };
  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(
      `ERROR @ saveSystemPermission -> system-permission.services.js`,
      error
    );

    // checking if the error stems from duplicate value in database
    const isDuplicateError = error && error.code === 11000;

    // fetching fields which caused duplication error
    const duplicateErrorFields = Object.keys(error.keyValue).join(`, `);

    // setting value of status and description
    const [status, err] = [
      isDuplicateError ? CONFLICT : SERVER_ERROR,
      isDuplicateError
        ? `System permission creation failed due to duplicate ${duplicateErrorFields}.`
        : `System permission creation failed.`,
    ];

    // returning response to indicate failure to its caller
    return {
      status,
      error: err,
    };
  }
};

// this data service takes in system permission id and query scope, fetches
// system permission stored in the database
const findUserById = async (userId) => {
  try {
    // querying database for the requested system permission
    const result = await User.findOne({ _id: userId })
      .select("-__v")
      .lean()
      .exec();

    // checking the result of the query
    if (!result) {
      // this code runs in case query didn't return anything from database

      return {
        status: NOT_FOUND,
        error: `Requested data not found in database.`,
      };
    }

    // returning fetched data to its caller
    return {
      status: SUCCESS,
      data: result,
    };
  } catch (error) {
    // this code runs in case of an error @ runtime

    // loggine error messages to the console
    logError(
      `ERROR @ findSystemPermissionById -> system-permission.services.js`,
      error
    );

    // returning 'SERVER_ERROR' to indicate failure to its caller
    return {
      status: SERVER_ERROR,
      error: `Unhandled exception occured on the server.`,
    };
  }
};

// this data service takes in query scope, fetches all system permissions stored in
// the database
const findAllUsers = async (requestQuery) => {
  try {
    let { page, recordsPerPage, sort, filters } = requestQuery;
    page = Number(page);
    recordsPerPage = Number(recordsPerPage);
    sort = JSON.parse(sort);
    filters = JSON.parse(filters);
    console.log(page, recordsPerPage, sort, filters);

    let conditionObj = {};

    if (filters.firstName) {
      conditionObj["firstName"] = filters.firstName;
    }

    if (filters.lastName) {
      conditionObj["lastName"] = filters.lastName;
    }

    if (filters.email) {
      conditionObj["email"] = filters.email;
    }

    if (filters.phoneNumber) {
      conditionObj["phoneNumber"] = filters.phoneNumber;
    }

    if (filters.address) {
      conditionObj["address"] = filters.address;
    }

    if (filters.role === "WORKER" || filters.role === "RECRUITER") {
      conditionObj["role"] = filters.role;
    }

    console.log(conditionObj);

    const totalUsers = await User.countDocuments({
      ...conditionObj,
      isDeleted: false,
    });

    // querying database for all system permissions
    const result = await User.find({ ...conditionObj, isDeleted: false })
      .select("-__v")
      .skip(recordsPerPage * (page - 1))
      .limit(recordsPerPage)
      .sort(sort)
      .lean()
      .exec();

    let pager = {
      page: page,
      recordsPerPage: recordsPerPage,
      filteredRecords: result.length,
      totalRecords: totalUsers,
    };

    // returning saved system permissions to its caller
    return {
      status: SUCCESS,
      pager: pager,
      data: result,
    };
  } catch (error) {
    // this code runs in case of an error @ runtime

    // loggine error messages to the console
    logError(
      `ERROR @ findSystemPermissions -> system-permission.services.js`,
      error
    );

    // returning response to indicate failure to its caller
    return {
      status: SERVER_ERROR,
      error: `Unhandled exception occured on the server.`,
    };
  }
};

// this data service takes in system permission id, update data object and query
// scope, updates system permission stored in the database according to the
// provided params and returns the updated system permission.
const findUserByIdAndUpdate = async (
  userId,
  updateData
  // updateBy,
) => {
  try {
    // fetching required data from incoming updateBy
    // const { _bearer, allowedSystemPermissions } = updateBy;

    console.log(userId, updateData);

    // creating an obj to store query config params
    const configParams = {
      new: true,
      runValidators: true,
    };

    // looping through update data obj to parse it as required
    for (const attr in updateData) {
      // checking current attr and parsing data accordingly
      if (attr === `isDeleted`) {
        // this code runs in case current field is 'isDeleted'

        // adding change log in the database
        updateData[`$push`] = {
          updateLogs: {
            update: {
              field: attr,
              value: updateData[attr],
            },
            _updater: _bearer,
            updatedAt: Date.now(),
          },
        };

        // stopping the current loop
        break;
      } else {
        // this code runs in case current attr doesn't match any of
        // above

        // adding change log in the database
        updateData[`$push`] = {
          updateLogs: {
            update: {
              field: attr,
              value: updateData[attr],
            },
            // _updater: _bearer,
            updatedAt: Date.now(),
          },
        };
      }
    }

    // querying database for the requested system permission
    const result = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      updateData,
      configParams
    )
      .select(`-__v`)
      .lean()
      .exec();

    // checking the result of the query
    if (!result) {
      // this code runs in case query didn't return anything from database

      return {
        status: NOT_FOUND,
        error: `Requested data not found in database.`,
      };
    }

    // returning fetched data to its caller
    return {
      status: SUCCESS,
      data: result,
    };
  } catch (error) {
    // this code runs in case of an error @ runtime

    // loggine error messages to the console
    logError(
      `ERROR @ findSystemPermissionByIdAndUpdate -> system-permission.services.js`,
      error
    );

    // checking if the error stems from duplicate value in database
    const isDuplicateError = error && error.code === 11000;

    // fetching fields which caused duplication error
    const duplicateErrorFields = Object.keys(error.keyValue).join(`, `);

    // setting value of status and description
    const [status, err] = [
      isDuplicateError ? CONFLICT : SERVER_ERROR,
      isDuplicateError
        ? `System permission update failed due to duplicate ${duplicateErrorFields}.`
        : `System permission update failed.`,
    ];

    // returning response to indicate failure to its caller
    return {
      status,
      error: err,
    };
  }
};

// this data service takes in system permission id, update data object and query
// scope, updates system permission stored in the database according to the
// provided params and returns the updated system permission.
const findUserByIdAndAddCV = async (
  userId,
  updateData
  // updateBy,
) => {
  try {
    const { cvId } = updateData;

    let updateQuery = {
      $push: {},
    };

    updateQuery["$push"]["selectedCVs"] = cvId;

    // creating an obj to store query config params
    const configParams = {
      new: true,
      runValidators: true,
    };

    // querying database for the requested system permission
    const result = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      updateQuery,
      configParams
    )
      .select(`-__v`)
      .lean()
      .exec();

    // checking the result of the query
    if (!result) {
      // this code runs in case query didn't return anything from database

      return {
        status: NOT_FOUND,
        error: `Requested data not found in database.`,
      };
    }

    // returning fetched data to its caller
    return {
      status: SUCCESS,
      data: result,
    };
  } catch (error) {
    // this code runs in case of an error @ runtime

    // loggine error messages to the console
    logError(
      `ERROR @ findSystemPermissionByIdAndUpdate -> system-permission.services.js`,
      error
    );

    // checking if the error stems from duplicate value in database
    const isDuplicateError = error && error.code === 11000;

    // fetching fields which caused duplication error
    const duplicateErrorFields = Object.keys(error.keyValue).join(`, `);

    // setting value of status and description
    const [status, err] = [
      isDuplicateError ? CONFLICT : SERVER_ERROR,
      isDuplicateError
        ? `System permission update failed due to duplicate ${duplicateErrorFields}.`
        : `System permission update failed.`,
    ];

    // returning response to indicate failure to its caller
    return {
      status,
      error: err,
    };
  }
};

// this data service takes in system permission id, update data object and query
// scope, updates system permission stored in the database according to the
// provided params and returns the updated system permission.
const findUserByIdAndRemoveCV = async (
  userId,
  updateData
  // updateBy,
) => {
  try {
    const { cvId } = updateData;

    let updateQuery = {
      $pull: {},
    };

    updateQuery["$pull"]["selectedCVs"] = cvId;

    // creating an obj to store query config params
    const configParams = {
      new: true,
      runValidators: true,
    };

    // querying database for the requested system permission
    const result = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      updateQuery,
      configParams
    )
      .select(`-__v`)
      .lean()
      .exec();

    // checking the result of the query
    if (!result) {
      // this code runs in case query didn't return anything from database

      return {
        status: NOT_FOUND,
        error: `Requested data not found in database.`,
      };
    }

    // returning fetched data to its caller
    return {
      status: SUCCESS,
      data: result,
    };
  } catch (error) {
    // this code runs in case of an error @ runtime

    // loggine error messages to the console
    logError(
      `ERROR @ findSystemPermissionByIdAndUpdate -> system-permission.services.js`,
      error
    );

    // checking if the error stems from duplicate value in database
    const isDuplicateError = error && error.code === 11000;

    // fetching fields which caused duplication error
    const duplicateErrorFields = Object.keys(error.keyValue).join(`, `);

    // setting value of status and description
    const [status, err] = [
      isDuplicateError ? CONFLICT : SERVER_ERROR,
      isDuplicateError
        ? `System permission update failed due to duplicate ${duplicateErrorFields}.`
        : `System permission update failed.`,
    ];

    // returning response to indicate failure to its caller
    return {
      status,
      error: err,
    };
  }
};

// this data service takes in system permission id and query scope, fetches
// system permission stored in the database
const findUserByEmail = async (email) => {
  try {
    // querying database for the requested system permission
    const result = await User.findOne({ email: email })
      .select("-__v")
      .lean()
      .exec();

    // checking the result of the query
    if (!result) {
      // this code runs in case query didn't return anything from database

      return {
        getUserByEmailStatus: NOT_FOUND,
        error: `Requested data not found in database.`,
      };
    }

    // returning fetched data to its caller
    return {
      getUserByEmailStatus: SUCCESS,
      userFound: result,
    };
  } catch (error) {
    // this code runs in case of an error @ runtime

    // loggine error messages to the console
    logError(
      `ERROR @ findSystemPermissionById -> system-permission.services.js`,
      error
    );

    // returning 'SERVER_ERROR' to indicate failure to its caller
    return {
      status: SERVER_ERROR,
      error: `Unhandled exception occured on the server.`,
    };
  }
};

// exporting controllers as modules
module.exports = {
  signup,
  login,
  findUserById,
  findAllUsers,
  findUserByIdAndUpdate,
  findUserByIdAndAddCV,
  findUserByIdAndRemoveCV,
  findUserByEmail,
};
