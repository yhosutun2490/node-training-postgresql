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
  adminCoach,
  revenue
} = require("../controllers/adminCoachController")


const config = require("../config/index");
const { userAuth } = require("../middlewares/auth");
const { AuthMechanism } = require("typeorm");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

// 取得教練自己的個人資料
router.get("/",auth, adminCoach.get)

// 取得教練個人營收資料(月份)
router.get("/revenue",auth,revenue.get)

// 新增使用者為教練
router.post(
  "/:userId",
  auth,
  [createCoachValidate,isCreateCoachAlreadyExist],
  adminCoach.post
);



module.exports = router;
