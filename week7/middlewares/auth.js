// 驗證token 並取出payload id 比對資料庫
const jwt = require("jsonwebtoken");
const { generateError } = require("../utils/generateError");

const tokeErrorStatus = 401
/**
 * token驗證失敗訊息
 */
const FailedMessageMap = {
  expired: "Token 已過期",
  invalid: "無效的 token",
  missing: "請先登入",
};

/**
 * 依據jwt verify token回傳錯誤 產生error物件
 * @param {object} jwtError jwt error object
 * @returns
 */
function formatVerifyError(jwtError) {
  let result;
  switch (jwtError.name) {
    case "TokenExpiredError":
      result = generateError(tokeErrorStatus, FailedMessageMap.expired);
      break;
    default:
      result = generateError(tokeErrorStatus, FailedMessageMap.invalid);
      break;
  }
  return result;
}

/**
 * 驗證並解析 JWT Token
 * @param {string} token - 需要解析的 JWT Token
 * @param {string} secret - 簽章用的 secret 私鑰
 * @returns {Promise<Object>} - 解析後的 payload，如果驗證失敗則拋出錯誤
 */
function verifyToken(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decode) => {
      if (err) {
        reject(formatVerifyError(err));
      } else {
        resolve(decode);
      }
    });
  });
}

/**
 * 使用者身份驗證 Middleware
 * 1. 驗證 JWT Token 並解析
 * 2. 在資料庫中查詢 ID 確認使用者存在
 * @param {object} options - Middleware 參數
 * @param {string} options.secret - JWT 簽章私鑰
 * @param {object} options.repository - TypeORM 數據庫 (應包含 `findOneBy` 方法)
 * @param {function} [options.logger=console] - 錯誤日誌記錄器
 * @returns {function} Express middleware
 */
function userAuth({secret, repository, logger = console}) {
  if (!secret || typeof secret !== "string") {
    logger.error("[AuthV2] secret is required and must be a string.");
    throw new Error("[AuthV2] secret is required and must be a string.");
  }
  if (
    !repository ||
    typeof repository !== "object" ||
    typeof repository.findOneBy !== "function"
  ) {
    logger.error("[AuthV2] userRepository is required and must be a function.");
    throw new Error(
      "[AuthV2] userRepository is required and must be a function."
    );
  }
  return async function (req, res, next) {
    if (
        !req.headers ||
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer')
      ) {
        logger.warn('[AuthV2] Missing authorization header.')
        next(generateError(401, FailedMessageMap.missing))
        return
      }
    // 取出Bearer token參數
    const [,token] = req.headers.authorization.split(' ')
    if (!token) {
        logger.warn('[AuthV2] Missing token.')
        next(generateError(tokeErrorStatus, FailedMessageMap.missing))
        return
      }
    try {
        const verifyResult = await verifyToken(token, secret)
        // find id in database
        const user = await repository.findOneBy({
            id: verifyResult.id
        })
        if (!user) {
            next(generateError(tokeErrorStatus, FailedMessageMap.invalid))
            return
        }
        // pass id info to request
        req.user = user
        next()
    } catch(err) {
        logger.error(`[AuthV2]${err.message}`)
        next(err)
    }

  }
}
module.exports = {
    userAuth
}