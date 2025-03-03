const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoachController");
const { catchAsync } = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

const adminCoach = {
  get: catchAsync(async (req, res, next) => {
    // 取得教練自己的詳細資料 get coach data by id
    // inner join User , Coach Table and skill table (coach skills ids)
    // 需要更新教練skills資料時 skill link關聯才能正確，需要left join確保尚未新增skill，保留資料正確
    const userId = req.user.id;
    const userTable = dataSource.getRepository("User");
    const coachResult = await userTable
      .createQueryBuilder("user")
      .innerJoinAndSelect("Coach", "coach", "user.id = coach.user_id")
      .leftJoinAndSelect(
        "CoachLinkSkill",
        "skill_link",
        "skill_link.coach_id = coach.id"
      )
      .where("user.id = :id", { id: userId })
      .select([
        "coach.id AS id",
        "coach.experience_years AS experience_years",
        "coach.description AS description",
        "coach.profile_image_url AS profile_image_url",
        "ARRAY_AGG(skill_link.skill_id) AS skill_ids", // 多組skills ids
      ])
      .groupBy("coach.id")
      .getRawMany();
    if (coachResult?.length) {
      // skill id null -> empty array
      if (!coachResult[0].skill_ids) {
        coachResult[0].skill_ids = [];
      }
      successResponse(res, coachResult[0], 200);
      return;
    } else {
      customErrorResponse(res, 400, "找不到該教練");
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
  put: catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    // coach data update into Coach Table
    // skills id (Array) update into Skill link Table
    const { experience_years, description, profile_image_url, skill_ids } =
      req.body;
    const coachTable = dataSource.getRepository("Coach");
    const updateCoachRes = await coachTable.update(
      { user_id: userId },
      { experience_years, description, profile_image_url }
    );

    // insert skill ids
    const skillLinkTable = dataSource.getRepository("CoachLinkSkill");
    const coachId = await coachTable.findOneBy({ user_id: userId });
    const skillData = skill_ids.map((skillId) => {
      return {
        coach_id: coachId.id,
        skill_id: skillId,
      };
    });
    const updateSkillRes = await skillLinkTable.upsert(skillData, {
      conflictPaths: ["coach_id", "skill_id"], // 設置複合唯一鍵，不重複插入
      skipUpdateIfNoValuesChanged: true,
    });
    successResponse(res, req.body, 200);
  }),
};

const revenue = {
  get: catchAsync(async (req, res, next) => {
    const userId = req.user.id; // coach user id

    // user purchase 單堂價格
    // 先聚合成一筆(包括重複購買組合包) 避免多筆join重複計算
    const userPurchasePriceQuery = await dataSource
      .getRepository("CreditPurchase")
      .createQueryBuilder("purchase")
      .select("purchase.user_id", "user_id")
      .addSelect(
        "SUM(purchase.price_paid) / NULLIF(SUM(purchase.purchased_credits), 0)", 
        "price_per_course"
      )
      .groupBy("purchase.user_id")
      .getQuery();

    const result = await dataSource
      .getRepository("Coach")
      .createQueryBuilder("coach")
      .innerJoinAndSelect("Course", "course", "coach.user_id = course.user_id")
      .innerJoinAndSelect(
        "CourseBooking",
        "booking",
        "booking.course_id = course.id"
      )
      .innerJoinAndSelect(
        `(${userPurchasePriceQuery})`,
        "up",
        "booking.user_id = up.user_id"
      )
      .where("coach.user_id = :userId", { userId: userId })
      .andWhere("booking.cancelled_at IS NULL")
      .select([
        'COUNT(booking.course_id) AS course_count',
        'COUNT(booking.user_id) AS participants',
        'SUM(up.price_per_course) AS revenue'
      ])
      .groupBy('course.user_id')
      .getRawMany();
    successResponse(res, result, 200);
  }),
};

module.exports = {
  adminCoach,
  revenue,
};
