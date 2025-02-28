const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CoachesController");
const catchAsync = require("../utils/catchAsync");
const {
  successResponse,
} = require("../middlewares/responseHandler");

const coaches = {
  getByPage: catchAsync(async (req, res, next) => {
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
  getById: catchAsync(async (req, res, next) => {
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
};

module.exports = {
  coaches,
};
