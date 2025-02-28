const { dataSource } = require("../../db/data-source");
const { generateError } = require('../../utils/generateError')
const { comparePassword } = require('../../utils/bcryptPassword')

/**
 * 檢查 email 是否已經被使用
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isEmailOrNameRepeat(req,res,next) {
    const email = req.body.email
    const name = req.body.name
    const userTable = await dataSource.getRepository("User");
    const existingUser = await userTable.findOne({
      where: [{email}, {name}]
    }); // find 其中一個符合
    if (existingUser) {
        const conflictField = existingUser.email === email ? "Email" : "Name";
        next(generateError(400, `${conflictField} 已經被使用`));
        return;
    } else {
        next()
    }
}

/**
 * 檢查使用者email或密碼是否存在或正確
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isUserExist (req,res,next) {
    const email = req.body.email
    const password = req.body.password
    const userTable = await dataSource.getRepository("User");
    const isUserExist = await userTable.findOne({
        where: { email },
        select: ["id","name","role","password"]
      });
  
    if (!isUserExist) {
        next(generateError(400,"使用者不存在或密碼輸入錯誤"))
        return
    }
    
    // bcript password check
    const databasePassword = isUserExist.password
    const isMatch = await comparePassword(password, databasePassword)
    if (!isMatch)  {
        next(generateError(400,"使用者不存在或密碼輸入錯誤"))
        return
    }

    req.id = isUserExist.id // 加入id傳遞
    req.role = isUserExist.role // 加入role傳遞
    req.name = isUserExist.name
    // pass
    next()
}


/**
 * 更新名稱是否一樣(無變更)
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isUpdateSameName(req,res,next) {
    const id = req.user.id
    const inputName = req.body.name
    const {name} = await dataSource.getRepository('User').findOne({
        where: {id},
        select: ['name']
    })
    if (name === inputName) {
        next(generateError(400,'使用者名稱未變更'))
        return
    }
    next()
}


/**
 * 更新名稱受否和資料庫所有資料有重複
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isDBhasSameName(req,res,next) {
    const inputName = req.body.name
    const isExistSameNameInDB = await dataSource.getRepository('User').find({
        where: {name: inputName},
    })
    if (isExistSameNameInDB.length) {
        next(generateError(400,'名稱已被其他人使用'))
        return
    }
    next()
}

/**
 * 更新個人密碼時 1. 檢查舊密碼是否輸入正確  2.新密碼是否與舊密碼不重複
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isUpdatePasswordCorrect(req, res, next) {
    const userId = req.user.id // token parse user id
    const inputPassword = req.body.password
    // find user with id
    const userData = await dataSource.getRepository('User').findOneBy({
        where: {id: userId},
    })
    // check input password is same 
    const isMatch = await comparePassword(password, databasePassword)

    
}

module.exports = {
    isEmailOrNameRepeat,
    isUserExist,
    isUpdateSameName,
    isDBhasSameName
}