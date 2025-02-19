const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Coaches");

const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

router.get("/", async (req, res, next) => {
  try {
    const { per, page } = req.query;
    const result = await dataSource
      .getRepository("Coach")
      .createQueryBuilder("coach")
      .leftJoin("User", "user", "user.id = coach.user_id") // 手動 JOIN User 表 reference
      .addSelect("user.name", "user_name") // 只拉回 user.name
      .skip((page - 1) * per)
      .take(per)
      .getRawMany();
    console.log('join res',result)
    successResponse(res, result, 200);
  } catch (err) {
    console.log('err',err)
    next(err);
  }
});
router.get("/:coachId", async (req, res, next) => {
  try {
    successResponse(res, req.params.coachId, 200);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
