const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoachController");
const { catchAsync } = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");
const config = require("../config/index");
const formidable = require("formidable");
const firebaseAdmin = require("firebase-admin");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    config.get("secret.firebase.serviceAccount")
  ),
  storageBucket: config.get("secret.firebase.storageBucket"),
});
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = {
  "image/jpeg": true,
  "image/png": true,
};
const bucket = firebaseAdmin.storage().bucket();
const uploadFile = {
  post: catchAsync(async (req, res, next) => {
    // form data parser
    const form = formidable.formidable({
      multiple: false,
      maxFileSize: MAX_FILE_SIZE,
      filter: ({ mimetype }) => {
        return !!ALLOWED_FILE_TYPES[mimetype];
      },
    });
    const [fields, files] = await form.parse(req);
    logger.info("files");
    logger.info(files);
    logger.info("fields");
    logger.info(fields);
    const filePath = files.file[0].filepath; // 本地伺服器站存url路徑
    const remoteFilePath = `images/${new Date().toISOString()}-${files.file[0].originalFilename}`

    // upload firebase storage
    await bucket.upload(filePath, { destination: remoteFilePath })
    const options = {
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000
      }
    const [imageUrl] = await bucket.file(remoteFilePath).getSignedUrl(options)
    successResponse(res,{
        image_url:imageUrl
    },200)
  }),
};

module.exports = {
  uploadFile,
};
