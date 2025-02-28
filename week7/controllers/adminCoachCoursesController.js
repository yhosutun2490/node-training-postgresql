const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoachController");
const catchAsync = require("../utils/catchAsync");

const adminCoachCourses = {
  getAllCourses: catchAsync(),
  getCoursesById: catchAsync(),
  postCourse: catchAsync(async (req, res, next) => {
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
  }),
  putCourse: catchAsync(async (req, res, next) => {
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
  }),
};

module.exports = {
    adminCoachCourses
}