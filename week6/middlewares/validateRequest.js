const {generateError} = require('../utils/generateError')

/**
 * 檢核 request 參數的 middleware
 * @param {import('zod').ZodObject} rules - Zod 驗證 schema
 * @param {number} statusCode - 可選的錯誤狀態碼，默認為 400
 * @returns {function} Express middleware
 */
function validateRequest(rules, statusCode = 400) {
    return (req, res, next) => {
      if (!rules?.safeParse) {
        return next(generateError(500, ['Invalid validation schema']));
      }
      const { success, error } = rules.safeParse({...req.body});
  
      if (success) {
        return next();
      } else {
        const errors = error.errors.map((item) => item.message);
        next(generateError(statusCode, errors));
      }
    };
  }
  
  module.exports = {validateRequest};
  
