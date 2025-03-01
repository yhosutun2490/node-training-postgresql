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

const { courses } = require("../controllers/coursesController")

const config = require("../config/index");
const { userAuth } = require("../middlewares/auth");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

// 取得所有課程
router.get("/", courses.get);
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
  courses.post
);

// 刪除課程報名 軟刪除 加入取消時間
router.delete("/:courseId", auth, [isCourseIdExist], courses.delete);

module.exports = router;
