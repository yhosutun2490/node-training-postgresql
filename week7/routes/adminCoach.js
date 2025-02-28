const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoach");
const {
  createCoachValidate,
} = require("../middlewares/admin/validateAdmin");

const {
  isCreateCoachAlreadyExist,
} = require("../middlewares/admin/index");

const {
  adminCoach
} = require("../controllers/adminCoachController")


const config = require("../config/index");
const { userAuth } = require("../middlewares/auth");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});


// 新增使用者為教練
router.post(
  "/:userId",
  auth,
  [createCoachValidate,isCreateCoachAlreadyExist],
  adminCoach.post
);

module.exports = router;
