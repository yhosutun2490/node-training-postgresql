const express = require("express");
const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Coaches");

const {
  getCoachByIdValidate,
} = require("../middlewares/coaches/validateCoaches");
const { 
  isCoachIdExist, 
  checkPaginationParams
} = require("../middlewares/coaches/index");
const {
  customErrorResponse,
} = require("../middlewares/responseHandler");

const {
  coaches,
} = require("../controllers/coachesController")

// 取得教練列表分頁
router.get("/", checkPaginationParams, coaches.getCoachByPage)

// 根據id取得教練
router.get(
  "/:coachId",
  [getCoachByIdValidate, isCoachIdExist],
  coaches.getCoachById
);

// 根據id取得個別教練開課列表
router.get(
  "/:coachId/courses",
  [getCoachByIdValidate, isCoachIdExist],
  coaches.getCourseByCoachId
)



module.exports = router;
