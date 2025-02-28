const { dataSource } = require("../../db/data-source");
const { generateError } = require("../../utils/generateError");
const { catchAsync } = require('../../utils/catchAsync')
/**
 * 檢查教練id是否有對應資料
 * course_booking Table find course_id and user_id
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */

async function isCoachIdExist(req, res, next) {
  const targetId = req.params?.coachId;
  const isCoachExist = await dataSource.getRepository("Coach").find({
    where: { id: targetId },
  });
  if (!isCoachExist.length) {
    next(generateError(400, "找不到該教練"));
    return;
  }
  req.data = {coach: isCoachExist}
  next();
}

module.exports = {
  isCoachIdExist: catchAsync(isCoachIdExist),
};
