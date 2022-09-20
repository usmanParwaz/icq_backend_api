// importing required packages and modules
const aws = require(`aws-sdk`);
const { logError } = require(`../helpers/console.helpers`);

// importing required config params
const { HTTP_STATUS_CODES: { SUCCESS, NOT_FOUND, SERVER_ERROR } } = require(`../config`);
const { AWS_TEXTRACT_REGION, AWS_TEXTRACT_ACCESS_KEY_ID, AWS_TEXTRACT_SECRET_ACCESS_KEY } = require(`../credentials`);



// this controller takes in document file, uses AWS-Textract SDK
// to detect text in the document file and returns it to its caller
const detectDocumentText = async (docFile) => {

  try {

    // fetching pure base64 value excluding the metadata
    const pureBase64Data = docFile.startsWith(`data:`) ? docFile.split(`,`)[1] : docFile;

    // decoding and storing the base64 string
    const decodedBase64 = await Buffer.from(pureBase64Data, 'base64');

    // setting config for AWS
    aws.config.update({

      region: AWS_TEXTRACT_REGION,
      accessKeyId: AWS_TEXTRACT_ACCESS_KEY_ID,
      secretAccessKey: AWS_TEXTRACT_SECRET_ACCESS_KEY

    });

    // creating a new instance of AWS Textract
    const textract = new aws.Textract();

    // calling designated SDK method for detecting text and
    // storing it
    const result = await textract.detectDocumentText({ Document: { Bytes: decodedBase64 } }).promise();

    // returning the result to its caller
    return { status: SUCCESS, data: result };

  } catch (error) {
    // this code runs in case of an error @ runtime

    // logging error messages to the console
    logError(`ERROR @ detectDocumentText -> aws.services.js`, error);

    // returning response indicating failure to its caller
    return { status: SERVER_ERROR, error: `An unhandled exception occured on the server.` };

  }

}



// exporting services as modules
module.exports = {

  detectDocumentText

};