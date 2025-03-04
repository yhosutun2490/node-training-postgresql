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
} = require("../middlewares/creditPackage/index")

const {
  creditPackageValidator,
  deletePackageValidator,
  purchasePackageValidator
} = require("../middlewares/creditPackage/validateCreditPackage");

const {
  creditPackage
} = require("../controllers/creditPackage")

// 取得課程包資訊(前台顯示)
router.get("/", auth, creditPackage.get);

// 新增課程包資訊(教練後台)
router.post("/", auth, [creditPackageValidator, isUserExitAndCoach], creditPackage.createPackage);

// 刪除課程包資訊(教練後台)
router.delete("/:id", auth, [deletePackageValidator, isUserExitAndCoach], creditPackage.delete);

// 使用者購買課程包(使用者須先登入)
router.post("/:creditPackageId", auth, [purchasePackageValidator, isPackageIdExist], creditPackage.buyPackage)

module.exports = router;
