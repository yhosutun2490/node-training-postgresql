const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Courses");
const { IsNull } = require("typeorm");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

const {
  isCourseIdExist,
  isUserAlreadyBooked,
  isUserRemainBookingCredits,
  isOverCourseMaxParticipants,
} = require("../middlewares/courses/index");

const config = require("../config/index");
const { userAuth } = require("../middlewares/auth");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

// 取得所有課程
router.get("/", async (req, res, next) => {
  try {
    const courseResult = await dataSource.getRepository("Course").find({
      select: [
        "id",
        "user_id",
        "skill_id",
        "name",
        "description",
        "start_at",
        "end_at",
        "max_participants",
        "meeting_url",
      ],
    });
    successResponse(res, courseResult, 200);
  } catch (err) {
    next(err);
  }
});
// 報名課程
router.post(
  "/:courseId",
  auth,
  [
    isCourseIdExist,
    isUserAlreadyBooked,
    isUserRemainBookingCredits,
    isOverCourseMaxParticipants,
  ],
  async (req, res, next) => {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    try {
      const bookingTable = dataSource.getRepository("COURSE_BOOKING");
      const newBooking = bookingTable.create({
        user_id: userId,
        course_id: courseId,
      });
      await bookingTable.save(newBooking);
      successResponse(res, null, 200);
    } catch (err) {
      next(err);
    }
  }
);

// 刪除課程報名 軟刪除 加入取消時間
router.delete("/:courseId", auth, [isCourseIdExist], async (req, res, next) => {
  const userId = req.user.id;
  const courseId = req.params.courseId;
  try {
    const bookingTable = dataSource.getRepository("COURSE_BOOKING");
    // update 條件->資料
    const updateResult = await bookingTable.update(
      {
        user_id: userId,
        course_id: courseId,
        cancelledAt: IsNull(),
      },
      {
        cancelledAt: new Date().toISOString(),
      }
    );

    if (updateResult.affected === 0) {
      customErrorResponse(res, 400, "取消失敗");
      return;
    }
    successResponse(res, null, 200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
