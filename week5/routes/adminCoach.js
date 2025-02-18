const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CoachSkill");
const {
  createCoachValidate,
  createCoachCoursesValidate,
} = require("../validation/admin");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

// 取得所有課程
router.get("/courses", async (req, res, next) => {
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

// 新增教練課程
router.post("/courses", async (req, res, next) => {
  try {
    console.log("api 教練課程");
    const bodyData = req.body;
    createCoachCoursesValidate(bodyData);
    const {
      user_id,
      skill_id,
      name,
      description,
      start_at,
      end_at,
      max_participants,
      meeting_url,
    } = bodyData;

    const isUserExist = await dataSource.getRepository("User").find({
      where: { id: user_id },
    });
    if (!isUserExist.length) {
      throw new Error("no-exist-member");
    } else if (isUserExist[0].role !== "coach") {
      throw new Error("is-not-coach");
    }
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
    if (err.name === "ZodError") {
      const zodErr = err.issues.map((item) => item.message);
      customErrorResponse(res, 400, zodErr);
    } else if (err.message === "no-exist-member") {
      customErrorResponse(res, 400, "使用者不存在");
    } else if (err.message === "is-not-coach") {
      customErrorResponse(res, 404, "使用者尚未成為教練");
    } else {
      next(err);
    }
  }
});

// 新增使用者為教練
router.post("/:userId", async (req, res, next) => {
  try {
    const requestData = {
      user_id: req.params?.userId,
      ...req.body,
    };

    // 參數驗證
    createCoachValidate(requestData);
    const { user_id, experience_years, description } = requestData;

    // 查找使用者
    const userTable = await dataSource.getRepository("User");
    const hasUser = await userTable.find({
      where: { id: user_id },
    });
    if (!hasUser.length) {
      throw new Error("no-exist-member");
    } else if (hasUser[0]?.role === "coach") {
      throw new Error("already-coach");
    }
    // 更新使用者 role 為 'coach'
    await userTable.update(user_id, { role: "coach" });

    // 創建coach資料
    try {
      const coachTable = await dataSource.getRepository("Coach");
      const createCoach = await coachTable.create({
        user_id,
        experience_years,
        description,
      });
      const createResult = await coachTable.save(createCoach);
      successResponse(
        res,
        {
          user: {
            name: hasUser[0].name,
            role: "coach",
          },
          coach: {
            createResult,
          },
        },
        201
      );
    } catch (err) {
      throw new Error("create-coach-failed");
    }
  } catch (err) {
    if (err.name === "ZodError") {
      const zodErr = err.issues.map((item) => item.message);
      customErrorResponse(res, 400, zodErr);
    } else if (err.message === "no-exist-member") {
      customErrorResponse(res, 400, "使用者不存在");
    } else if (err.message === "create-coach-failed") {
      customErrorResponse(res, 400, "更新使用者失敗");
    } else if (err.message === "already-coach") {
      customErrorResponse(res, 409, "使用者已經是教練");
    } else {
      next(err);
    }
  }
});

module.exports = router;
