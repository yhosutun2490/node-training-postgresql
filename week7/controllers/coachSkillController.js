const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CoachSkillController");
const catchAsync = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

const coachSkill = {
  get: catchAsync(async (req, res, next) => {
    const data = await dataSource.getRepository("Coach_Skill").find({
      select: ["id", "name"],
    });
    successResponse(res, data);
  }),
  post: catchAsync(async (req, res, next) => {
    // get datasource insert
    const { name } = req.body;
    const skillTable = await dataSource.getRepository("Coach_Skill");

    // 檢核package 名稱
    const result = await skillTable.insert({
      name: name,
    });
    const createId = result.identifiers[0]?.id;
    successResponse(res, {
      id: createId,
      name,
    });
  }),
  delete: catchAsync(async (req, res, next) => {
    const targetId = req.params?.id;
    const skillTable = await dataSource.getRepository("Coach_Skill");
    const result = await skillTable.delete({
      id: targetId,
    });

    if (result.affected) {
      successResponse(res, result);
    } else {
      logger.info('新增技能id錯誤')
      customErrorResponse(res,400,'ID錯誤')
      return
    }
  }),
};

module.exports = {
  coachSkill,
};
