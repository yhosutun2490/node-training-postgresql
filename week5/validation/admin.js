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

function createCoachCourseVakidate(body) {
  const rules = z.object({
    ueser_id:  z
    .string({
      invalid_type_error: "id必須是字串",
    })
    .nonempty("id不能為空")
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      "ID 必須是有效格式"
    ),
    sakill_id:  z
    .string({
      invalid_type_error: "id必須是字串",
    })
    .nonempty("id不能為空")
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      "ID 必須是有效格式"
    ),
    name: z
      .string({
        invalid_type_error: "課程name必須是字串",
      })
      .nonempty("課程名稱name不能為空"),
    description: z
      .string({
        invalid_type_error: "description必須是字串",
      })
      .nonempty("description不能為空"),
    start_at: z.string().datetime().nonempty("start_at不能為空"),
    end_at: z.string().datetime().nonempty("end_at不能為空"),
    max_participants:  z.number({
      required_error: "max_participants不能為空",
      invalid_type_error: "max_participants必須是數字",
    }).min(1, {message: "參與人數至少須設定1人"}),
    meeting_url: z
    .string({
      invalid_type_error: "meeting_url必須是字串",
    })
    .nonempty("meeting_url不能為空"),
    
  })
}

module.exports = {
  createCoachValidate,
};
