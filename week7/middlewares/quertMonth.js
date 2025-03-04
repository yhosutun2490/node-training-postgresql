const { generateError } = require('../utils/generateError')

const monthMap = {
  'january': 'Jan',
  'february': 'Feb',
  'march': 'Mar',
  'april': 'Apr',
  'may': 'May',
  'june': 'Jun',
  'july': 'Jul',
  'august': 'Aug',
  'september': 'Sep',
  'october': 'Oct',
  'november': 'Nov',
  'december': 'Dec',
};

/**
 * 檢查query params 中月份參數
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */


function validateMonthQuery(req,res,next) {
  const { month } = req.query
  if (!month) {
    return next(generateError(400,'請指定月份參數'))
  }
  
  const normalizedMonth = monthMap[month.trim()];

  if (!normalizedMonth) {
    return next(generateError(400, '無效的月份參數'));
  }

  const monthIndex = new Date(`${normalizedMonth} 1, 2000`).getMonth(); // 獲取對應的月份索引
  if (monthIndex === NaN) {
    return next(generateError(400, '無效的月份參數'));
  }

  const year = new Date().getFullYear(); // 使用當前年份
  const startDate = new Date(year, monthIndex , 1); // 當月第一天
  const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999); // 當月最後一天（23:59:59.999）

  req.monthRange = { startDate, endDate };
  next()
}

module.exports = {
  validateMonthQuery
}