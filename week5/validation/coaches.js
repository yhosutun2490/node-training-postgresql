const { z } = require("zod");

function getCoachByIdValidate(body) {
  const rules = z.object({
    user_id: z
      .string({
        invalid_type_error: "user_id必須是字串",
      })
      .nonempty("user_id不能為空")
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        "user_id必須是有效格式"
      ),
  });

  return rules.parse(body);
}
module.exports = {
  getCoachByIdValidate,
};
