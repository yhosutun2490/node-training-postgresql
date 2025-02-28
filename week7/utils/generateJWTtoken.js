const { reject } = require('bcrypt/promises')
const jwt = require('jsonwebtoken')
/**
 * 產生 JWT Token
 * @param {object} payload - JWT Payload，通常包含 `id` 或 `userInfo`
 * @param {string} secret - 簽章用的 secret 私鑰
 * @param {object} [option={}] - JWT 選項，例如過期時間 `expiresIn`
 * @returns {Promise<string>} - 解析後回傳 JWT Token 字串
 */
function generateJwtToken (payload, secret, option = {}) {
    return new Promise ((resolve, reject)=>{
        jwt.sign(payload, secret, option,(err ,token)=>{
            if (err) {
                reject(err)
                return
              }
              resolve(token)
        })
    })
}

module.exports = {
    generateJwtToken
}