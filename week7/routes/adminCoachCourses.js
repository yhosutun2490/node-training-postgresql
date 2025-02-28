const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoach");
const {
  createCoursesValidate,
  updateCourseValidate,
} = require("../middlewares/admin/validateAdmin");
const {
  isCoach,
  isCourseExist,
  isSkillExist,
} = require("../middlewares/admin/index");

const {
  adminCoachCourses
} = require("../controllers/adminCoachCoursesController")

const config = require("../config/index");
const { userAuth } = require("../middlewares/auth");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

// 新增教練課程
router.post(
  "/",
  [auth, createCoursesValidate,isCoach, isSkillExist],
  adminCoachCourses.postCourse
);

// 更新教練課程
router.put(
  "/:courseId",
  [auth, updateCourseValidate,isCoach, isCourseExist, isSkillExist],
 adminCoachCourses.putCourse
);



module.exports = router;
