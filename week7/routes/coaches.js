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
  coaches
} = require("../controllers/coachesController")

// 取得教練列表分頁
router.get("/", checkPaginationParams, coaches.getByPage)

// 根據id取得教練
router.get(
  "/:coachId",
  [getCoachByIdValidate, isCoachIdExist],
  coaches.getById
);

module.exports = router;
