const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CreditPackage");
const {
  creditPackageValidator,
  deletePackageValidator,
} = require("../validation/validation");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

router.get("/", async (req, res, next) => {
  try {
    const data = await dataSource.getRepository("CREDIT_PACKAGE").find({
      select: ["id", "name", "credit_amount", "price"],
    });
    successResponse(res, data);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    // 檢核 body
    const bodyData = req.body;
    creditPackageValidator(bodyData);

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

router.delete("/:id", async (req, res, next) => {
  try {
    const targetId = req.params?.id;
    // id 格式檢核
    deletePackageValidator({ id: targetId });
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

module.exports = router;
