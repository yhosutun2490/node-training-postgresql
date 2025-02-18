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
      .nonempty("description不能為空"),
  });
  return rules.parse(body);
}

function createCoachCourses(body) {
  const rules = z.object({
    name: z.string({
        invalid_type_error: "name必須是字串",
      }).max(100, { message: 'name上限為100字'}),
    description: z.string().nonempty("description不能為空"),
    start_at: z.string().datetime({
      invalid_type_error: "start_at必須是時間格式"
    }), // timestamp 檢查日期時間格式
    end_at: z.string().datetime({
      invalid_type_error: "end_at必須是時間格式"
    }), // timestamp 檢查日期時間格式
    max_participants: z.number().int().min(1, {
      message: '參與人數須至少1人'
    }), // 整數且至少 1 人
    meeting_url: z.string().url(), // 驗證是否為有效 URL
  });
  return rules.parse(body);
}

module.exports = {
  createCoachValidate,
  createCoachCourses,
};
