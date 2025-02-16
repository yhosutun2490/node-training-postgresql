const {z}  = require('zod')

// 定義請求參數的 Zod Schema
function creditPackageValidator (body) {
    const rules =  z.object({
        name: z.string({
            invalid_type_error: "name必須是字串",
        }).nonempty("名稱name不能為空"),
        credit_amount: z.number({
            required_error: "credit_amount不能為空",
            invalid_type_error: "credit_amount必須是數字",
          }).min(0, "credit_amount不能為負數"),
        price: z.number({
            required_error: "price不能為空",
            invalid_type_error: "price必須是數字",
          }),
    });
    return rules.parse(body)
}
function deletePackageValidator(params) {
    const rules =  z.object({
        id: z.string({
            invalid_type_error: "id必須是字串",
        }).nonempty("id不能為空")
        .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
            "ID 必須是有效格式"
          )
        })

    return rules.parse(params)
}

function createCoachesSkillValidator(body) {
    const rules =  z.object({
        name: z.string({
            invalid_type_error: "name必須是字串",
        }).nonempty("名稱name不能為空"),
    });
    return rules.parse(body)
}

function deleteSkillValidator(params) {
    const rules =  z.object({
        id: z.string({
            invalid_type_error: "id必須是字串",
        }).nonempty("id不能為空")
        .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
            "ID 必須是有效格式"
          )
        })

    return rules.parse(params)
}

module.exports = {
  creditPackageValidator,
  deletePackageValidator,
  createCoachesSkillValidator,
  deleteSkillValidator
}