const express = require("express");
const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Users");
const {
  userSignUpValidator,
  userLoginValidator,
  userUpdateProfileValidator,
  userUpdatePasswordValidator
} = require("../middlewares/users/validateUser");
const {
  isEmailOrNameRepeat,
  isUserExist,
  isUpdateSameName,
  isDBhasSameName,
} = require("../middlewares/users/index");

// controller
const {
  signup,
  login,
  profile,
  password: passwordController,
} = require("../controllers/usersController");

const { userAuth } = require("../middlewares/auth");
const config = require("../config/index");
const { password } = require("../config/db");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

router.post("/signup", [userSignUpValidator, isEmailOrNameRepeat], signup.post);

router.post("/login", [userLoginValidator, isUserExist], login.post);

// 取得個人資料
router.get("/profile", auth, profile.get);

// 更新個人資料
router.put(
  "/profile",
  [auth, userUpdateProfileValidator, isUpdateSameName, isDBhasSameName],
  profile.put
);

// 更新個人密碼
router.put("/password", auth, [userUpdatePasswordValidator], passwordController.put);
module.exports = router;
