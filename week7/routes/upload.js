const express = require("express");
const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Users");
const { userAuth } = require("../middlewares/auth");
const config = require("../config/index");
const { password } = require("../config/db");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

const {
    uploadFile
} = require("../controllers/upload")


// upload file 
router.post('/',auth,uploadFile.post)

module.exports = router