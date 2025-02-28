const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoachController");
const catchAsync = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

const adminCoach = {
  post: catchAsync(async (req, res, next) => {
    const requestData = {
      user_id: req.params?.userId,
      ...req.body,
    };
    const { user_id, experience_years, description, profile_image_url } =
      requestData;
    const userTable = dataSource.getRepository("User");
    // 更新使用者 role 為 'coach'
    await userTable.update(user_id, { role: "coach" });

    // 創建coach資料
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
          role: "coach",
        },
        coach: {
          createResult,
        },
      },
      201
    );
  }),
};

module.exports = {
  adminCoach,
};
