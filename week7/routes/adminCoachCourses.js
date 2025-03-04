const express = require("express");
const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoach");
const {
  createCoursesValidate,
  updateCourseValidate,
} = require("../middlewares/admin/validateAdmin");
const {
  getCoachCourseByIdValidate,
} = require("../middlewares/adminCourse/validateAdminCourse");
const {
  isCoach,
  isCourseExist,
  isSkillExist,
} = require("../middlewares/admin/index");

const {
  adminCoachCourses,
} = require("../controllers/adminCoachCourses");

const config = require("../config/index");
const { userAuth } = require("../middlewares/auth");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

// 根據課程id取得教練課程詳細資料
router.get(
  "/:courseId",
  auth,
  [isCoach, getCoachCourseByIdValidate],
  adminCoachCourses.getCoachCourseById
);

// 取得教練個人的所有課程
router.get("/", auth, isCoach, adminCoachCourses.getCoachCourse);

// 新增教練課程
router.post(
  "/",
  auth, [createCoursesValidate, isCoach, isSkillExist],
  adminCoachCourses.postCourse
);

// 更新教練課程
router.put(
  "/:courseId",
  [auth, updateCourseValidate, isCoach, isCourseExist, isSkillExist],
  adminCoachCourses.putCourse
);

module.exports = router;
