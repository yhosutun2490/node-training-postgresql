const express = require("express");
const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoach");
const {
  createCoachValidate,
  updateCoachValidate
} = require("../middlewares/admin/validateAdmin");

const {
  isCoach,
  isCreateCoachAlreadyExist,
} = require("../middlewares/admin/index");

const {
  validateMonthQuery
} = require("../middlewares/quertMonth")

const {
  adminCoach,
  revenue
} = require("../controllers/adminCoach")


const config = require("../config/index");
const { userAuth } = require("../middlewares/auth");

// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

// 取得教練自己的個人資料
router.get("/",auth, isCoach,adminCoach.get)

// 取得教練個人營收資料(月份)
router.get("/revenue",auth, [validateMonthQuery,isCoach],revenue.get)

// 新增使用者為教練
router.post(
  "/:userId",
  auth,
  [createCoachValidate,isCreateCoachAlreadyExist],
  adminCoach.post
);

// 更新教練資料
router.put("/",auth,[updateCoachValidate,isCoach],adminCoach.put)



module.exports = router;
