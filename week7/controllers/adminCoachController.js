const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoachController");
const { catchAsync } = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

const adminCoach = {
  get: catchAsync(async (req, res,next) => {
    // 取得教練自己的詳細資料 get coach data by id
    // inner join User , Coach Table and skill table (coach skills ids)
    // 需要修正新增或更新教練資料時 skill link關聯才能正確
    const userId = req.user.id
    const userTable = dataSource.getRepository('User')
    const coachResult  = await userTable.createQueryBuilder('user')
    .innerJoinAndSelect('Coach','coach',"user.id = coach.user_id")
    .innerJoinAndSelect('CoachLinkSkill','skill_link',"skill_link.coach_id = coach.id")
    .innerJoinAndSelect('CoachSkill','skill',"skill.id = skill_link.skill_id")
    .where("user.id = :id", {id: userId})
    .getRawMany()
    if (coachResult?.length) {
      successResponse(res,coachResult[0],200)
      return
    } else {
      customErrorResponse(res,400,'找不到該教練')
    }
  }),
  post: catchAsync(async (req, res, next) => {
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
