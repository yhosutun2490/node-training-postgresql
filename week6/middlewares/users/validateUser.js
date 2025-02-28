const { z } = require("zod");
const { validateRequest } = require('../validateRequest')

function userSignUpValidator(req,res,next) {
  const rules = z.object({
    name: z
      .string({
        invalid_type_error: "name必須是字串",
      })
      .min(2, { message: "名稱至少需2個字" })
      .max(10, { message: "名稱至多10個字" })
      .regex(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, "名稱不可包含特殊符號或空白")
      .nonempty("名稱name不能為空"),
    email: z
      .string({
        invalid_type_error: "name必須是字串",
      })
      .email({ message: "email必須是符合格式" })
      .nonempty("email不能為空"),
    password: z
      .string({
        invalid_type_error: "name必須是字串",
      })
      .min(8, { message: "密碼至少需8位數" })
      .max(16, { message: "密碼至多16位數" })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
        "密碼需包含至少 1 個大寫字母、1 個小寫字母"
      )
      .nonempty("密碼不能為空"),
    role: z
      .string({
        invalid_type_error: "name必須是字串",
      })
      .nonempty("權限角色不能為空"),
  });
  validateRequest(rules)(req, res, next)
}
function userLoginValidator(req, res, next) {
  const rules = z.object({
    email: z
      .string({
        invalid_type_error: "name必須是字串",
      })
      .email({ message: "email必須是符合格式" })
      .nonempty("email不能為空"),
    password: z
      .string({
        invalid_type_error: "password必須是字串",
      })
      .min(8, { message: "密碼至少需8位數" })
      .max(16, { message: "密碼至多16位數" })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
        "密碼需包含至少 1 個大寫字母、1 個小寫字母"
      )
      .nonempty("密碼不能為空"),
  });
  validateRequest(rules)(req, res, next)
}

function userUpdateProfileValidator(req, res, next) {

  const rules = z.object({
    name: z
      .string({
        invalid_type_error: "name必須是字串",
      })
      .min(2, { message: "名稱至少需2個字" })
      .max(10, { message: "名稱至多10個字" })
      .regex(/^[a-zA-Z0-9]+$/, "名稱不可包含特殊符號或空白")
      .nonempty("名稱name不能為空"),
  });
  validateRequest(rules)(req, res, next)
}



module.exports = {
  userSignUpValidator,
  userLoginValidator,
  userUpdateProfileValidator
};
