const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoach");
const {
  createCoachValidate,
  createCoursesValidate,
  updateCourseValidate,
} = require("../middlewares/admin/validateAdmin");

const {
  isCoach,
  isCreateCoachAlreadyExist,
  isCourseExist,
  isSkillExist,
} = require("../middlewares/admin/index");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

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
  async (req, res, next) => {
    try {
      const {
        user_id,
        skill_id,
        name,
        description,
        start_at,
        end_at,
        max_participants,
        meeting_url,
      } = req.body;

      const courseTable = await dataSource.getRepository("Course");
      const createCourse = await courseTable.create({
        user_id,
        skill_id,
        name,
        description,
        start_at,
        end_at,
        max_participants,
        meeting_url,
      });
      const saveResult = await courseTable.save(createCourse);
      successResponse(
        res,
        {
          course: {
            id: saveResult.id,
            user_id,
            skill_id,
            name,
            description,
            start_at,
            end_at,
            max_participants,
            meeting_url,
            created_at: saveResult.created_at,
            updated_at: saveResult.updated_at,
          },
        },
        201
      );
    } catch (err) {
      next(err);
    }
  }
);

// 更新教練課程
router.put(
  "/:courseId",
  [auth, updateCourseValidate,isCoach, isCourseExist, isSkillExist],
  async (req, res, next) => {
    try {
      const courseTable = await dataSource.getRepository("Course");

      const updateResult = await courseTable.update(
        { id: req.params.courseId },
        { ...req.body }
      );
      if (updateResult.affected > 0) {
        successResponse(
          res,
          {
            course: {
              ...req.body,
            },
          },
          200
        );
      } else {
        throw new Error("update-failed");
      }
    } catch (err) {
      if (err.message === "update-failed") {
        customErrorResponse(res, 400, "更新失敗");
        return;
      } else {
        next(err);
      }
    }
  }
);



module.exports = router;
