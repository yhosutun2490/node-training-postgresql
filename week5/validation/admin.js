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

function createCoursesValidate(body) {
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
    skill_id: z
      .string({
        invalid_type_error: "skill_id必須是字串",
      })
      .nonempty("skill_id不能為空")
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        "skill_id必須是有效格式"
      ),
    name: z
      .string({
        invalid_type_error: "name必須是字串",
      })
      .max(100, { message: "name上限為100字" })
      .nonempty("name不能為空"),
    description: z.string().nonempty("description不能為空"),
    start_at: z.string().nonempty("start_at不能為空"),
    end_at: z.string().nonempty("end_at不能為空"),
    max_participants: z.number().int().min(1, {
      message: "max_participants須至少1人",
    }), // 整數且至少 1 人
    meeting_url: z.string().url(), // 驗證是否為有效 URL
  });
  return rules.parse(body);
}

function updateCourseValidate(body) {
  const rules = z.object({
    course_id: z
      .string({
        invalid_type_error: "course_id必須是字串",
      })
      .nonempty("course_id不能為空")
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        "course_id必須是有效格式"
      ),
    skill_id: z
      .string({
        invalid_type_error: "skill_id必須是字串",
      })
      .nonempty("skill_id不能為空")
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        "skill_id必須是有效格式"
      ),
    user_id: z
      .string({
        invalid_type_error: "user_id必須是字串",
      })
      .nonempty("user_id不能為空")
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        "user_id必須是有效格式"
      ),
    skill_id: z
      .string({
        invalid_type_error: "skill_id必須是字串",
      })
      .nonempty("skill_id不能為空")
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        "skill_id必須是有效格式"
      ),
    name: z
      .string({
        invalid_type_error: "name必須是字串",
      })
      .max(100, { message: "name上限為100字" })
      .nonempty("name不能為空"),
    description: z.string().nonempty("description不能為空"),
    start_at: z.string().nonempty("start_at不能為空"),
    end_at: z.string().nonempty("end_at不能為空"),
    max_participants: z.number().int().min(1, {
      message: "max_participants須至少1人",
    }), // 整數且至少 1 人
    meeting_url: z.string().url(), // 驗證是否為有效 URL
  });
  return rules.parse(body);
}

module.exports = {
  createCoachValidate,
  createCoursesValidate,
  updateCourseValidate,
};
