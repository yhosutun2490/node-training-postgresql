const { z } = require("zod");
const { validateRequest } = require("../validateRequest");


/**
 * 檢核技能參數名稱name
 * @param {import('zod').ZodObject} rules - Zod 驗證 schema
 * @param {number} statusCode - 可選的錯誤狀態碼，默認為 400
 * @returns {function} Express middleware
 */
function createCoachesSkillValidator(req, res, next) {
  const rules = z.object({
    name: z
      .string({
        invalid_type_error: "name必須是字串",
      })
      .nonempty("名稱name不能為空"),
  });
  validateRequest(rules)(req, res, next);
}


/**
 * 檢核刪除技能id參數
 * @param {import('zod').ZodObject} rules - Zod 驗證 schema
 * @param {number} statusCode - 可選的錯誤狀態碼，默認為 400
 * @returns {function} Express middleware
 */
function deleteSkillValidator(req, res, next) {
  const rules = z.object({
    id: z
      .string({
        invalid_type_error: "id必須是字串",
      })
      .nonempty("id不能為空")
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        "ID 必須是有效格式"
      ),
  });
  const targetId = req.params?.id;
  req.body = {id: targetId,...req.body}
  validateRequest(rules)(req, res, next);
  delete req.body.id
}

module.exports = {
    createCoachesSkillValidator,
    deleteSkillValidator
}