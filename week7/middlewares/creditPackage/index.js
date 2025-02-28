const { dataSource } = require("../../db/data-source");
const { generateError } = require("../../utils/generateError");
/**
 * 檢查user是否存在和角色role為教練('coach')
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isUserExitAndCoach(req, res, next) {
  const id = req.user.id; // JWT token parse id
  const existingUser = await dataSource.getRepository("User").findOne({
    where: [{ id }],
  });
  if (existingUser) {
    const isNotCoach = existingUser.role !== "coach";
    if (isNotCoach) {
      next(generateError(400, "使用者尚未成為教練"));
      return;
    } else {
      next();
    }
  } else {
    next(generateError(400, "使用者不存在"));
  }
}

/**
 * 檢查課程包id是否存在
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isPackageIdExist(req, res, next) {
  const targetId = req.params.creditPackageId;
  const existingPackage = await dataSource
    .getRepository("CREDIT_PACKAGE")
    .findOne({
      where: [{ id: targetId }],
    });
  if (!existingPackage) {
    next(generateError(400, "課程組合包id不存在"));
    return;
  } else {
    req.package = existingPackage;
    next();
  }
}

/**
 * 檢查資料庫中課程包是否同名
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function hasSameNamePackage(req, res, next) {
  const bodyData = req.body;

  // get datasource insert
  const { name } = bodyData;
  const packageTable = await dataSource.getRepository("CREDIT_PACKAGE");

  // 檢核package 名稱
  const hasSamePackageName = await packageTable.findOne({
    where: { name },
  });

  if (hasSamePackageName) {
    next(generateError(409,'資料重複'))
    return
  }
  next()
}

module.exports = {
  isUserExitAndCoach,
  isPackageIdExist,
};
