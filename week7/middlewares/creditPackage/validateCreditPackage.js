const {z}  = require('zod');
const { validateRequest } = require('../validateRequest')

// 定義請求參數的 Zod Schema
function creditPackageValidator (req, res, next) {
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
    validateRequest(rules)(req, res, next)
}
function deletePackageValidator(req, res, next) {
    const rules =  z.object({
        delete_id: z.string({
            invalid_type_error: "id必須是字串",
        }).nonempty("id不能為空")
        .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
            "ID 必須是有效格式"
          )
        })
    req.body = {delete_id: req.params.id, ...req.body}
    validateRequest(rules)(req, res, next)
    delete req.body.delete_id
}

function purchasePackageValidator(req, res, next) {
    const rules =  z.object({
        package_id: z.string({
            invalid_type_error: "package id必須是字串",
        }).nonempty("package id不能為空")
        .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
            "package id 必須是有效格式"
          )
        })
    req.body = {package_id: req.params.creditPackageId, ...req.body}
    validateRequest(rules)(req, res, next)
    delete req.body.package_id
}

module.exports = {
    creditPackageValidator,
    deletePackageValidator,
    purchasePackageValidator
}