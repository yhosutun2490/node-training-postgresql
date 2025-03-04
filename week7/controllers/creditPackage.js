const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoachController");
const { catchAsync } = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

const creditPackage = {
  get: catchAsync(async (req, res, next) => {
    const data = await dataSource.getRepository("CREDIT_PACKAGE").find({
      select: ["id", "name", "credit_amount", "price"],
    });
    successResponse(res, data);
  }),
  createPackage: catchAsync(
    async (req, res, next) => {
      // 檢核 body
      const bodyData = req.body;

      // get datasource insert
      const { name, credit_amount, price } = bodyData;
      const packageTable = await dataSource.getRepository("CREDIT_PACKAGE");

      // 檢核package 名稱
      const hasSamePackageName = await packageTable.findOne({
        where: { name },
      });

      if (!hasSamePackageName) {
        const result = await packageTable.insert({
          name: name,
          credit_amount: credit_amount,
          price: price,
        });
        const createId = result.identifiers[0]?.id;
        successResponse(res, {
          id: createId,
          name,
        });
      } else {
        customErrorResponse(res, 409, '資料重複')
      }

    }
  ),
  buyPackage: catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const packageData = req.package // isPackageIdExist middleware 檢查後傳出
    const purchaseTable = dataSource.getRepository('CreditPurchase')
    const newPurchase = await purchaseTable.create({
      user_id: userId,
      credit_package_id: packageData.id,
      purchased_credits: packageData.credit_amount,
      price_paid: packageData.price,
      purchaseAt: new Date().toISOString()
    })
    await purchaseTable.save(newPurchase)
    successResponse(res, null, 200)
  }),
  delete: catchAsync(async (req, res, next) => {

    const targetId = req.params?.id;
    // id 格式檢核
    const packageTable = await dataSource.getRepository("CREDIT_PACKAGE");
    const result = await packageTable.delete({
      id: targetId,
    });

    if (result.affected) {
      successResponse(res, result);
      return
    } else {
      customErrorResponse(res, 400, "ID錯誤");
    }
  }),
};

module.exports = {
  creditPackage,
};
