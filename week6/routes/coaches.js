const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Coaches");

const {
  getCoachByIdValidate,
} = require("../middlewares/coaches/validateCoaches");
const { isCoachIdExist } = require("../middlewares/coaches/index");

const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

// 取得教練列表分頁
router.get("/", async (req, res, next) => {
  try {
    const { per, page } = req.query;
    if (per && page) {
      const result = await dataSource
        .getRepository("Coach")
        .createQueryBuilder("coach")
        .leftJoin("User", "user", "user.id = coach.user_id") // JOIN User 表
        .select([
          "coach.id",
          "coach.experience_years",
          "coach.description",
          "user.name",
        ])
        .skip((page - 1) * per)
        .take(per)
        .getRawMany();
      successResponse(res, result, 200);
    } else {
      throw new Error("lack-query-search");
    }
  } catch (err) {
    if (err.message === "lack-query-search") {
      customErrorResponse(res, 400, "請指定參數");
    } else {
      next(err);
    }
  }
});

// 根據id取得教練
router.get(
  "/:coachId",
  [getCoachByIdValidate, isCoachIdExist],
  async (req, res, next) => {
    try {
      const coachData = req.data.coach;

      const user = await dataSource.getRepository("User").findOne({
        where: { id: coachData[0]?.user_id },
        select: ["name", "role"], // 只選取 id 和 name
      });

      successResponse(
        res,
        {
          user,
          coach: coachData[0],
        },
        200
      );
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
