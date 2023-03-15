// importing required packages and modules
const mongoose = require(`mongoose`);
const { logWarning, logError } = require(`../helpers/console.helpers`);
const fs = require("fs");

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
  SERVER_ADDRESS,
} = require(`../config`);

// requiring required schemas
const CV = require(`../../api/models/cv.model`);

// this data service takes in system permission data obj and _creator, saves system
// role in the local database and returns response to its caller
const saveCV = async (cvData, filePath) => {
  try {
    // creating an object to store new system permission
    const cv = new CV({
      _id: new mongoose.Types.ObjectId(),
      firstName: cvData.firstName,
      lastName: cvData.lastName,
      workerType: cvData.workerType,
      cvUrl: filePath,
      price: cvData.price,
      userId: cvData.userId,
    });

    console.log(cv);

    // saving new system permission in the database
    const result = await cv.save();

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

const saveCvPdf = async (userId, cvPdf, cvPdfName) => {
  try {
    let filePath;

    // preparing base64
    let base64 = cvPdf;

    const testString = `/[^:/]\w+(?=;|,)/`;

    //retrieve file extention from base64 string
    let extension = String(base64).match(testString)[0];
    // console.log('media type', extension);

    //extracting image from base64
    let base64Image = base64.split("base64,")[1];
    // console.log('image', base64Image);

    //creating fodler in projects directory
    let pathToMakeFolder = `./public/cv/${userId}/`;
    // console.log('path to make folder', pathToMakeFolder);

    // creating folder if it has not been created yet
    if (!fs.existsSync(pathToMakeFolder)) {
      fs.mkdirSync(`./public/cv/${userId}/`, { recursive: true });
    }

    // creating file path
    filePath = `./public/cv/${userId}/${cvPdfName}.${extension}`;

    // writing file
    fs.writeFile(filePath, base64Image, "base64", async (err) => {
      if (err) {
        return res.status(httpsStatus.BAD_GATEWAY).json({
          message: "Error in saving pdf",
          error: err,
        });
      }
      // console.log('*** File Written to this Path ***', filePath);
    });

    filePath = filePath.split("./")[1];
    filePath = `${SERVER_ADDRESS}/${filePath}`;
    return filePath;
  } catch (error) {
    console.log(error);
  }
};

// this data service takes in system permission id and query scope, fetches
// system permission stored in the database
const findCvById = async (cvId) => {
  try {
    // querying database for the requested system permission
    const result = await CV.findOne({ _id: cvId })
      .populate({
        path: `userId`,
        select: `-password`,
      })
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
const findAllCVs = async () => {
  try {
    // querying database for all system permissions
    const result = await CV.find({ isDeleted: false })
      .populate({ path: `userId`, select: `-password` })
      .select("-__v")
      .lean()
      .exec();

    // returning saved system permissions to its caller
    return {
      status: SUCCESS,
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

// this data service takes in query scope, fetches all system permissions stored in
// the database
const findFilteredCVs = async (requestQuery) => {
  try {
    let { page, recordsPerPage, sort, filters } = requestQuery;

    page = Number(page);
    recordsPerPage = Number(recordsPerPage);
    sort = JSON.parse(sort);
    filters = JSON.parse(filters);

    let conditionObj = {};

    if (filters.firstName) {
      conditionObj[`firstName`] = filters.firstName;
    }

    if (filters.lastName) {
      conditionObj[`lastName`] = filters.lastName;
    }

    if (filters.workerType) {
      conditionObj[`workerType`] = filters.workerType;
    }

    const totalCVs = await CV.countDocuments({
      ...conditionObj,
      isDeleted: false,
    });

    // querying database for all system permissions
    const result = await CV.find({ ...conditionObj, isDeleted: false })
      .populate({
        path: `userId`,
        select: `firstName lastName email phoneNumber address`,
      })
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
      totalRecords: totalCVs,
    };

    console.log(result);

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
const findCvByIdAndUpdate = async (
  cvId,
  updateData,
  // updateBy,
  queryScope
) => {
  try {
    // fetching required data from incoming updateBy
    // const { _bearer, allowedSystemPermissions } = updateBy;

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
            // _updater: _bearer,
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
    const result = await CV.findOneAndUpdate(
      { _id: cvId, isDeleted: false },
      updateData,
      configParams
    )
      .select(queryScope)
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

// exporting controllers as modules
module.exports = {
  saveCV,
  saveCvPdf,
  findCvById,
  findAllCVs,
  findFilteredCVs,
  findCvByIdAndUpdate,
};
