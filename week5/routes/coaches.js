const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Coaches");

const { getCoachByIdValidate } = require("../validation/coaches");

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
router.get("/:coachId", async (req, res, next) => {
  try {
    const targetId = req.params?.coachId;
    getCoachByIdValidate({
      user_id: targetId,
    });
    const isCoachExist = await dataSource.getRepository("Coach").find({
      where: { id: targetId },
    });
    if (isCoachExist.length) {
      const user = await dataSource.getRepository("User").findOne({
        where: { id: isCoachExist[0]?.user_id },
        select: ["name", "role"], // 只選取 id 和 name
      });

      successResponse(
        res,
        {
          user,
          coach: isCoachExist[0],
        },
        200
      );
    } else {
      throw new Error("coach-not-exist");
    }
  } catch (err) {
    if (err.name === "ZodError") {
      const zodErr = err.issues.map((item) => item.message);
      customErrorResponse(res, 400, zodErr);
    } else if (err.message === "coach-not-exist") {
      customErrorResponse(res, 400, "找不到該教練");
    }
    next(err);
  }
});

module.exports = router;
