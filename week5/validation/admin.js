const { z } = require("zod");

function createCoachValidate(body) {
  const rules = z.object({
    user_id: z
      .string({
        invalid_type_error: "id必須是字串",
      })
      .nonempty("id不能為空")
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        "ID 必須是有效格式"
      ),
    experience_years: z
      .number({
        required_error: "experience_years不能為空",
        invalid_type_error: "experience_years必須是數字",
      })
      .min(0, "experience_years不能為負數"),
    description: z
      .string({
        invalid_type_error: "description必須是字串",
        required_error: "description不能為空",
      })
      .nonempty("description不能為空",),
  });
  return rules.parse(body);
}

module.exports = {
  createCoachValidate,
};
