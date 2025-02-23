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
async function isEmailRepeat(req,res,next) {
    const email = req.email
    const userTable = await dataSource.getRepository("User");
    const hasSameEmail = await userTable.findOne({
      where: { email },
    });
    if (hasSameEmail) {
        next(generateError(400,"Email已經被使用"))
        return
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
        select: ["id","email","name","password"]
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
    req.name = isUserExist.name
    // pass
    next()
}

async function isUpdateSameName(req,res,next) {
    const id = req.user.id
    const inputName = req.body.name
    const isExistSameNameUser = await dataSource.getRepository('User').findOne({
        where: {id},
        select: ['name']
    })
    if (isExistSameNameUser.name === inputName) {
        next(generateError(400,'使用者名稱未變更'))
        return
    }
    next()
}

module.exports = {
    isEmailRepeat,
    isUserExist,
    isUpdateSameName
}