const { dataSource } = require("../../db/data-source");
const { generateError } = require("../../utils/generateError");
/**
 * 檢查user是否存在和角色role為教練('coach')
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isUserExitAndCoach(req,res,next) {
    const id = req.user.id // JWT token parse id
    const existingUser = await dataSource.getRepository("User").findOne({
        where: [{ id }],
    });
    if (existingUser) {
        const isNotCoach = existingUser.role !== 'COACH';
        if (isNotCoach) {
            next(generateError(400, '使用者尚未成為教練'));
            return;
        } else {
            next()
        }
       
    } else {
        next(generateError(400, '使用者不存在'));
    }
}

/**
 * 檢查課程包id是否存在
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isPackageIdExist(req,res,next) {
    const targetId = req.params.creditPackageId
    const existingPackage = await dataSource.getRepository("CREDIT_PACKAGE").findOne({
        where: [{ id: targetId }],
    });
    if(!existingPackage) {
        next(generateError(400, '課程組合包id不存在'));
        return
    } else {
        req.package = existingPackage
        next()
    }
}

module.exports = {
    isUserExitAndCoach,
    isPackageIdExist
}