const { dataSource } = require("../../db/data-source");
const { generateError } = require("../../utils/generateError");
const { IsNull } = require("typeorm");
const { catchAsync } = require('../../utils/catchAsync')

/**
 * 檢查是否有重複技能名稱
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function hasSameSkillName(req, res, next) {
    // get datasource insert
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