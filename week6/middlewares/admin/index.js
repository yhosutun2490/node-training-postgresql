
const { dataSource } = require("../../db/data-source");
const { generateError } = require('../../utils/generateError')

/**
 * 檢查user是否存在和角色role為教練('coach')
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isCoach(req,res,next) {
    const role = req.user.role
    if (role !== 'coach') {
        next(generateError(400, '使用者尚未成為教練'));
        return;
    } 
    next()
}

/**
 * 創建教練資料時判斷user是否已經為教練('coach')
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isCreateCoachAlreadyExist(req,res,next) {
    const id = req.body.user_id || req.params.userId
    const existingUser = await dataSource.getRepository("User").findOne({
        where: [{ id }],
    });
    if (existingUser) {
        const isCoach = existingUser.role === 'coach';
        if (isCoach) {
            next(generateError(400, '使用者已經是教練'));
            return;
        } else {
            req.name = existingUser.name
            next()
        }
       
    } else {
        next(generateError(400, '使用者不存在'));
    }
}

/**
 * 檢查course id 課程是否存在
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isCourseExist(req,res,next) {
    const courseId = req.params?.courseId;
    const isExistingCourse = await dataSource.getRepository("Course").findOne({
        where: [ { id: courseId }],
    });
    if (!isExistingCourse) {
        next(generateError(400, '該course id無對應課程'));
        return;
    } else {
        next()
    }
}

/**
 * 檢查skill id 技能是否存在
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isSkillExist(req,res,next) {
    const skillId = req.body?.skill_id;
    const isExistingSkill = dataSource.getRepository("Coach_Skill").findOne({
        where: { id: skillId },
    });
    if (!isExistingSkill) {
        next(generateError(400, '該skill id無對應技能'));
        return;
    } else {
        next()
    }
}

module.exports = {
    isCoach,
    isCreateCoachAlreadyExist,
    isCourseExist,
    isSkillExist
}