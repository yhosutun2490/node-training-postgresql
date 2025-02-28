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
  "/courses",
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
  "/courses/:courseId",
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

// 新增使用者為教練
router.post(
  "/:userId",
  auth, createCoachValidate,isCreateCoachAlreadyExist,
  async (req, res, next) => {
    try {
      const requestData = {
        user_id: req.params?.userId,
        ...req.body,
      };
      const { user_id, experience_years, description, profile_image_url } =
        requestData;
      const userTable = dataSource.getRepository("User");
      // 更新使用者 role 為 'coach'
      await userTable.update(user_id, { role: "COACH" });

      // 創建coach資料
      try {
        const coachTable = dataSource.getRepository("Coach");
        const createCoach = coachTable.create({
          user_id: req.params?.userId,
          experience_years,
          description,
          profile_image_url,
        });
        const createResult = await coachTable.save(createCoach);
        successResponse(
          res,
          {
            user: {
              name: req.name,
              role: "COACH",
            },
            coach: createResult,
          },
          201
        );
      } catch (err) {
        throw new Error("create-coach-failed");
      }
    } catch (err) {
      if (err.message === "create-coach-failed") {
        console.log("update err", err);
        customErrorResponse(res, 400, "更新使用者失敗");
      } else {
        next(err);
      }
    }
  }
);

module.exports = router;
