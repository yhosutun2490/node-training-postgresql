const { dataSource } = require("../../db/data-source");
const { generateError } = require("../../utils/generateError");

async function hasSameSkillName(req, res, next) {
  const { name } = req.body;
  const skillTable = await dataSource.getRepository("Coach_Skill");

  // 檢核package 名稱
  const hasSameSkillName = await skillTable.findOne({
    where: { name },
  });

  if (hasSameSkillName) {
    next(generateError(409,'資料重複'))
    return
  } 
  next()
}

module.exports = {
    hasSameSkillName
}
