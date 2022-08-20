/**
 * Multer strategy to upload images
 * @author Yousuf Kalim
 */
const multer = require('multer');

// Multer strategy for local uploading. (Read multer's documentation for more details)
exports.upload = multer({
  // to store images
  storage: multer.diskStorage({
    // Defining the path where we have to store the image
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Callback
    },
    // Creating a unique filename to avoid duplication error
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Callback
    },
  }),
  // File size limit upto 5 mb
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

exports.appPicturesUpload = multer({
  storage: multer.diskStorage({
    // Defining the path where we have to store the image
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Callback
    },
    // Creating a unique filename to avoid duplication error
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Callback
    },
  }),
  // File size limit upto 10 mb
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
}).fields([
  {
    name: 'eventImage',
    maxCount: 1,
  },
  {
    name: 'codeImage',
    maxCount: 1,
  },
]);
