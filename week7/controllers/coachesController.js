const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CoachesController");
const { catchAsync } = require("../utils/catchAsync");
const { successResponse } = require("../middlewares/responseHandler");

const coaches = {
  getCoachByPage: catchAsync(async (req, res, next) => {
    const { per, page } = req.query;

    const result = await dataSource
      .getRepository("Coach")
      .createQueryBuilder("coach")
      .leftJoin("User", "user", "user.id = coach.user_id") // JOIN User 表
      .select([
        "coach.id",
        "coach.experience_years",
        "coach.description",
        "user.name",
      ])
      .skip((page - 1) * per)
      .take(per)
      .getRawMany();
    successResponse(res, result, 200);
  }),
  getCoachById: catchAsync(async (req, res, next) => {
    const coachData = req.data.coach;

    const user = await dataSource.getRepository("User").findOne({
      where: { id: coachData[0]?.user_id },
      select: ["name", "role"], // 只選取 id 和 name
    });

    successResponse(
      res,
      {
        user,
        coach: coachData[0],
      },
      200
    );
  }),
  getCourseByCoachId: catchAsync(async (req, res, next) => {
    const coachId = req.params.coachId; // coach table id

    // 先取出userid 再去course table join
    const courseTable = dataSource.getRepository("Course");
    const coachTable = dataSource.getRepository("Coach");
    const userResult = await coachTable
      .createQueryBuilder("coach")
      .where("coach.id = :id", { id: coachId })
      .innerJoin("coach.user", "user")
      .select("user.id")
      .getRawOne();
    const user_id = userResult.user_id;

    // course table join User and Skill get name
    const courseLists = await courseTable
      .createQueryBuilder("course")
      .innerJoin("course.user", "user")
      .innerJoin("course.coachSkill", "skill")
      .where("course.user_id = :user_id", { user_id })
      .select([
        "course.id AS id",
        "course.name AS name",
        "course.description AS description",
        "course.start_at AS start_at",
        "course.end_at AS end_at",
        "course.max_participants AS max_participants",
        "user.name AS coach_name",
        "skill.name AS skill_name",
      ])
      .getRawMany();

    successResponse(res, courseLists, 200);
  }),
};

module.exports = {
  coaches,
};
