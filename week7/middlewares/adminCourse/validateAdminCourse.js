const { z } = require("zod");
const { validateRequest } = require('../validateRequest')
/**
 * 檢查課程uudi是否正確
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
function getCoachCourseByIdValidate(req, res, next) {
  const rules = z.object({
    course_id: z
      .string({
        invalid_type_error: "課程id必須是字串",
      })
      .nonempty("課程id不能為空")
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        "課程id必須是有效格式"
      ),
  });
  req.body = {...req.body,course_id: req.params.courseId}
  validateRequest(rules)(req, res, next)
  delete req.body.course_id
}

module.exports = {
    getCoachCourseByIdValidate
}