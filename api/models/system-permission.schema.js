// importing required modules
const mongoose = require(`mongoose`);



// defining system permission schema
const systemPermissionSchema = new mongoose.Schema({

  name: {
    type: String,
    uppercase: true,
    trim: true,
    unique: true,
    default: null
  },
  description: {
    type: String,
    uppercase: true,
    trim: true,
    default: null
  },

}, {

  _id: false

});



// exporting schema as module
module.exports = {

  systemPermissionSchema

};