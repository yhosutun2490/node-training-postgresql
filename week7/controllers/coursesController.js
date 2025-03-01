const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoachController");
const { catchAsync } = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

const courses = {
  get: catchAsync(async (req, res, next) => {
    // join table user table (get name), skill table (get skill name)
    const courseResult = await dataSource
      .getRepository("Course")
      .createQueryBuilder("course")
      .innerJoin("course.user", "user") // 關聯 User
      .innerJoin("course.coachSkill", "skill") // 關聯 Coach_Skill
      .select([
        "course.id",
        "user.name AS coach_name",
        "skill.name",
        "course.name",
        "course.description",
        "course.start_at",
        "course.end_at",
        "course.max_participants",
      ])
      .getRawMany();
      successResponse(res, courseResult,200)
  }),
  post: catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    const bookingTable = dataSource.getRepository("COURSE_BOOKING");
    const newBooking = bookingTable.create({
      user_id: userId,
      course_id: courseId,
    });
    await bookingTable.save(newBooking);
    successResponse(res, null, 200);
  }),
  delete: catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const courseId = req.params.courseId;

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
  }),
};

module.exports = {
  courses,
};
