const express = require("express");
const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CreditPackage");

const config = require("../config/index");
const { userAuth } = require("../middlewares/auth");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

const {
  isUserExitAndCoach,
  isPackageIdExist
} = require("../middlewares//creditPackage/index")

const {
  creditPackageValidator,
  deletePackageValidator,
  purchasePackageValidator
} = require("../middlewares/creditPackage/validateCreditPackage");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

// 取得課程包資訊(教練後台)
router.get("/", [auth, isUserExitAndCoach],async (req, res, next) => {
  try {
    const data = await dataSource.getRepository("CREDIT_PACKAGE").find({
      select: ["id", "name", "credit_amount", "price"],
    });
    successResponse(res, data);
  } catch (err) {
    next(err);
  }
});

// 新增課程包資訊(教練後台)
router.post("/", [auth,creditPackageValidator ,isUserExitAndCoach],async (req, res, next) => {
  try {
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
      throw new Error("repeat_name");
    }
  } catch (err) {
    if (err.name === "ZodError") {
      customErrorResponse(res, 403, "欄位未填寫正確");
    } else if (err.message == "repeat_name") {
      customErrorResponse(res, 409, "資料重複");
    } else {
      next(err);
    }
  }
});

// 刪除課程包資訊(教練後台)
router.delete("/:id",[auth, deletePackageValidator ,isUserExitAndCoach],async (req, res, next) => {
  try {
    const targetId = req.params?.id;
    // id 格式檢核
    const packageTable = await dataSource.getRepository("CREDIT_PACKAGE");
    const result = await packageTable.delete({
      id: targetId,
    });

    if (result.affected) {
      successResponse(res, result);
    } else {
      throw new Error("id_not_found");
    }
  } catch (err) {
    if (err.message === "id_not_found") {
      customErrorResponse(res, 400, "ID錯誤");
    } else if (err.name === "ZodError") {
      customErrorResponse(res, 403, "ID未填寫正確");
    } else {
      next(err);
    }
  }
});

// 使用者購買課程包(使用者須先登入)
router.post("/:creditPackageId", [auth, purchasePackageValidator,isPackageIdExist],async(req ,res ,next)=>{
  try {
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
    successResponse(res,null,200)
  } catch(err) {
    next(err)
  }
})

module.exports = router;
